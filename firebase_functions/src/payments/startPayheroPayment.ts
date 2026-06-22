import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import axios from "axios";
import {v4 as uuidv4} from "uuid";
import {
  PAYHERO_BASE_URL,
  getPayheroAuth,
  getChannelId,
  getCallbackUrl,
  normalizePhone,
} from "./config.js";

const db = admin.firestore();

/**
 * Generic M-Pesa STK push via PayHero.
 * This function is fully independent of any app business logic.
 * It does not know what the payment is for — that's stored in `metadata`
 * and interpreted by the `onPaymentConfirmed` trigger.
 *
 * Input:
 *   { amount, phoneNumber, description, metadata }
 *
 * Returns:
 *   { paymentId }
 */
export const startPayheroPayment = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Sign in required.");
  }

  const uid = request.auth.uid;
  const amount = request.data?.amount as number | undefined;
  const rawPhone = request.data?.phoneNumber as string | undefined;
  const description = request.data?.description as string | undefined;
  const metadata = request.data?.metadata as Record<string, unknown> | undefined;

  if (!amount || amount <= 0) {
    throw new HttpsError("invalid-argument", "amount must be a positive number.");
  }
  if (!rawPhone) {
    throw new HttpsError("invalid-argument", "phoneNumber is required.");
  }
  if (!description) {
    throw new HttpsError("invalid-argument", "description is required.");
  }

  const phone = normalizePhone(rawPhone);
  if (!/^(07|01)\d{8}$/.test(phone)) {
    throw new HttpsError("invalid-argument", "Invalid phone number. Use format 07xxxxxxxx or 01xxxxxxxx.");
  }

  const paymentId = uuidv4();
  const paymentRef = db.collection("payments").doc(paymentId);

  await paymentRef.set({
    paymentId,
    userId: uid,
    amount,
    phone,
    description,
    status: "pending",
    checkoutRequestID: null,
    confirmedVia: null,
    confirmedAt: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    metadata: metadata ?? {},
  });

  try {
    const response = await axios.post(
      `${PAYHERO_BASE_URL}/payments`,
      {
        amount,
        phone_number: phone,
        channel_id: getChannelId(),
        provider: "m-pesa",
        external_reference: paymentId,
        callback_url: getCallbackUrl(),
        description,
      },
      {
        headers: {
          "Authorization": `Basic ${getPayheroAuth()}`,
          "Content-Type": "application/json",
        },
        timeout: 30_000,
      },
    );

    const checkoutRequestID: string | null =
      (response.data as Record<string, unknown>)?.reference as string ?? null;

    await paymentRef.update({checkoutRequestID});

    return {paymentId};
  } catch (err: unknown) {
    const e = err as {response?: {data?: {message?: string}}; message?: string};
    const errMsg = e?.response?.data?.message ?? e?.message ?? "PayHero error";

    await paymentRef.update({status: "failed", errorMessage: errMsg});

    logger.error("startPayheroPayment: STK push failed", {paymentId, uid, errMsg});
    throw new HttpsError("internal", "Failed to initiate payment. Please try again.");
  }
});
