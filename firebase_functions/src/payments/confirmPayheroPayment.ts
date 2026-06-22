import {onRequest, onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import axios from "axios";
import {PAYHERO_BASE_URL, getPayheroAuth, getCallbackSecret} from "./config.js";

const db = admin.firestore();
const TERMINAL = new Set(["paid", "failed", "cancelled"]);

function toInternalStatus(raw: string | undefined): string | null {
  const s = raw?.toUpperCase();
  if (s === "SUCCESS" || s === "SUCCESSFUL" || s === "COMPLETED") return "paid";
  if (s === "FAILED" || s === "FAILURE" || s === "FAIL") return "failed";
  if (s === "CANCELLED" || s === "CANCELED") return "cancelled";
  return null;
}

async function updatePaymentStatus(
  paymentId: string,
  newStatus: string,
  via: "callback" | "polling",
  checkoutRequestID?: string,
): Promise<void> {
  const update: Record<string, unknown> = {
    status: newStatus,
    confirmedVia: via,
    confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  if (checkoutRequestID) update.checkoutRequestID = checkoutRequestID;
  await db.collection("payments").doc(paymentId).update(update);
}

/**
 * HTTP endpoint — PayHero posts here when a payment completes.
 * Updates payments/{paymentId}.status and nothing else.
 * The onPaymentConfirmed Firestore trigger handles all app-level logic.
 */
export const payheroCallback = onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const expectedSecret = getCallbackSecret();
  if (expectedSecret && req.query.key !== expectedSecret) {
    logger.warn("payheroCallback: rejected request with invalid/missing key");
    res.status(401).json({error: "Unauthorized"});
    return;
  }

  try {
    const payload = req.body as Record<string, unknown>;
    logger.info("PayHero callback", {payload});

    const paymentId = payload?.external_reference as string | undefined;
    const rawStatus = payload?.status as string | undefined;
    const checkoutRequestID = payload?.reference as string | undefined;

    if (!paymentId) {
      res.status(400).json({error: "Missing external_reference"});
      return;
    }

    const status = toInternalStatus(rawStatus);
    if (!status) {
      res.status(200).json({received: true, status: "ignored"});
      return;
    }

    const paymentSnap = await db.collection("payments").doc(paymentId).get();
    if (!paymentSnap.exists) {
      logger.warn("payheroCallback: payment not found", {paymentId});
      res.status(404).json({error: "Payment not found"});
      return;
    }

    const existingData = paymentSnap.data() as Record<string, unknown>;

    // Idempotent — already terminal
    if (TERMINAL.has(existingData.status as string)) {
      res.status(200).json({received: true, status: "already_terminal"});
      return;
    }

    await updatePaymentStatus(paymentId, status, "callback", checkoutRequestID);
    res.status(200).json({received: true, status});
  } catch (err) {
    logger.error("payheroCallback error", err);
    res.status(500).json({error: "Internal server error"});
  }
});

/**
 * Callable — the web app polls this every few seconds as a fallback while
 * waiting for the `payheroCallback` webhook to land.
 * Hits PayHero status API, updates Firestore if status changed.
 * Idempotent — safe to call multiple times.
 *
 * Input:  { paymentId }
 * Returns: { status }
 */
export const checkPaymentStatus = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Sign in required.");
  }

  const paymentId = request.data?.paymentId as string | undefined;
  if (!paymentId) {
    throw new HttpsError("invalid-argument", "paymentId is required.");
  }

  const paymentSnap = await db.collection("payments").doc(paymentId).get();
  if (!paymentSnap.exists) {
    throw new HttpsError("not-found", "Payment not found.");
  }

  const paymentData = paymentSnap.data() as Record<string, unknown>;

  if (paymentData.userId !== request.auth.uid) {
    throw new HttpsError("permission-denied", "Access denied.");
  }

  const currentStatus = paymentData.status as string;
  if (TERMINAL.has(currentStatus)) {
    return {status: currentStatus};
  }

  const checkoutRequestID = paymentData.checkoutRequestID as string | null;
  if (!checkoutRequestID) {
    return {status: paymentData.status};
  }

  try {
    const response = await axios.get(`${PAYHERO_BASE_URL}/transaction-status`, {
      params: {reference: checkoutRequestID},
      headers: {"Authorization": `Basic ${getPayheroAuth()}`},
      timeout: 15_000,
    });

    const newStatus = toInternalStatus((response.data as Record<string, unknown>)?.status as string);

    if (newStatus && newStatus !== paymentData.status) {
      await updatePaymentStatus(paymentId, newStatus, "polling");
      return {status: newStatus};
    }

    return {status: paymentData.status};
  } catch (err) {
    logger.warn("checkPaymentStatus: PayHero API error", {paymentId, err});
    return {status: paymentData.status};
  }
});
