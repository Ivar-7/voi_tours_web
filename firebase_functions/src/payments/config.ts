export const PAYHERO_BASE_URL = "https://backend.payhero.co.ke/api/v2";

export function getPayheroAuth(): string {
  const key = process.env.PAYHERO_API_KEY;
  const secret = process.env.PAYHERO_API_SECRET;
  if (!key || !secret) throw new Error("PayHero credentials not configured");
  return Buffer.from(`${key}:${secret}`).toString("base64");
}

export function getChannelId(): number {
  const id = process.env.PAYHERO_CHANNEL_ID;
  return id ? parseInt(id, 10) : 5466;
}

export function getCallbackUrl(): string {
  const url = process.env.PAYHERO_CALLBACK_URL;
  if (!url) throw new Error("PAYHERO_CALLBACK_URL not configured");

  const secret = process.env.PAYHERO_CALLBACK_SECRET;
  if (!secret) return url;

  // Append a shared-secret query param so `payheroCallback` can reject
  // forged requests — without this, anyone who learns a `paymentId` could
  // POST a fake "paid" status (the callback has no other auth, since
  // PayHero doesn't sign its webhook payloads).
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}key=${encodeURIComponent(secret)}`;
}

export function getCallbackSecret(): string | undefined {
  return process.env.PAYHERO_CALLBACK_SECRET;
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length === 12) return `0${digits.substring(3)}`;
  if (digits.startsWith("7") && digits.length === 9) return `0${digits}`;
  if (digits.startsWith("1") && digits.length === 9) return `0${digits}`;
  return digits;
}
