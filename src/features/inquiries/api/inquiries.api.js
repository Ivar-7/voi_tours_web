import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase/firebase.js";
import { normaliseError } from "@/shared/api";

const COLLECTION = "inquiries";

/**
 * Submits a new public lead inquiry. Anyone may write to this collection
 * (see `firestore.rules`) — `_hp` (the honeypot field) is stripped before
 * the write; if it was filled in, the caller is a bot and the doc is
 * silently dropped instead of written.
 *
 * @param {object} payload — validated against `inquirySchema`, including `_hp`
 * @returns {Promise<import('@/shared/types/models').Inquiry|null>}
 */
export async function submitInquiry(payload) {
  try {
    const { _hp, ...fields } = payload;
    if (_hp) return null; // honeypot tripped — drop silently, no error

    const docData = {
      ...fields,
      is_converted: false,
      assigned_agent_id: null,
      created_at: serverTimestamp(),
    };

    const ref = await addDoc(collection(db, COLLECTION), docData);
    return { ...docData, id: ref.id, created_at: new Date().toISOString() };
  } catch (error) {
    throw normaliseError(error);
  }
}
