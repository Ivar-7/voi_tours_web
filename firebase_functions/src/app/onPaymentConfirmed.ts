import {onDocumentUpdated} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

const db = admin.firestore();

/**
 * App-specific reconciliation: when a `payments/{paymentId}` document
 * transitions to `status: "paid"`, credit the linked booking
 * (`metadata.bookingId`, set by the frontend when it calls
 * `startPayheroPayment`) and escalate its `payment_status`.
 *
 * Firestore triggers are at-least-once, so this guards against double
 * crediting the same payment via an `appliedToBooking` flag written in the
 * same transaction that updates the booking.
 */
export const onPaymentConfirmed = onDocumentUpdated(
  "payments/{paymentId}",
  async (event) => {
    const after = event.data?.after.data();
    if (!after || after.status !== "paid") return;

    const bookingId = (after.metadata as Record<string, unknown> | undefined)
      ?.bookingId as string | undefined;
    if (!bookingId) return;

    const paymentRef = event.data!.after.ref;
    const bookingRef = db.collection("bookings").doc(bookingId);

    await db.runTransaction(async (tx) => {
      const [paymentSnap, bookingSnap] = await Promise.all([
        tx.get(paymentRef),
        tx.get(bookingRef),
      ]);

      if (!bookingSnap.exists) {
        logger.warn("onPaymentConfirmed: booking not found", {bookingId});
        return;
      }

      const paymentData = paymentSnap.data() as Record<string, unknown>;
      if (paymentData.appliedToBooking) return; // already credited

      const booking = bookingSnap.data() as Record<string, unknown>;
      const totalAmount = booking.total_amount as number | null;
      const paidAmount = (Number(booking.paid_amount) || 0) + Number(after.amount || 0);

      // Never downgrade a booking that's already fully paid (e.g. a stray
      // extra payment shouldn't flip it back to "partially_paid").
      const paymentStatus =
        booking.payment_status === "fully_paid"
          ? "fully_paid"
          : totalAmount != null && paidAmount >= totalAmount
            ? "fully_paid"
            : "partially_paid";

      tx.update(bookingRef, {
        paid_amount: paidAmount,
        payment_status: paymentStatus,
        status: booking.status === "pending" ? "confirmed" : booking.status,
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      tx.update(paymentRef, {appliedToBooking: true});
    });

    logger.info("onPaymentConfirmed: booking credited", {bookingId});
  },
);
