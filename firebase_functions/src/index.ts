import * as admin from "firebase-admin";

admin.initializeApp();

// ── Payment functions (PayHero integration — app-independent) ─────────────────
export {startPayheroPayment} from "./payments/startPayheroPayment.js";
export {payheroCallback, checkPaymentStatus} from "./payments/confirmPayheroPayment.js";

// ── App triggers (business logic after payment events) ────────────────────────
export {onPaymentConfirmed} from "./app/onPaymentConfirmed.js";
