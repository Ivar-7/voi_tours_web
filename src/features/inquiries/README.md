# Inquiries Feature

## Responsibilities

- Unauthenticated lead-capture form at `/inquiry`, writing directly to the
  Firestore `inquiries` collection (no backend).
- Honeypot spam protection: the `_hp` field is validated by
  `inquirySchema` (must be empty) and stripped server-side in
  `inquiries.api.js` — if it's filled in, the submission is silently
  dropped instead of written.
- Admins/agents view, assign, and convert inquiries from the admin feature
  (`src/features/admin/`).

## Firestore Rules

`inquiries/{id}`: `create` is open to anyone (public form, no auth); `read`
and `update` are restricted to `admin`/`agent`. See
`src/config/firebase/firestore.rules`.

## Files

| Path                                     | Role                                       |
| ------------------------------------------ | --------------------------------------------- |
| `api/inquiries.api.js`                     | Firestore `addDoc` + honeypot drop          |
| `hooks/useSubmitInquiry.js`                | Mutation wrapping `submitInquiry`           |
| `schema/inquiry.schema.js`                 | Zod schema incl. honeypot field             |
| `components/InquiryForm.jsx`               | The form itself                             |
| `components/InquirySuccessMessage.jsx`     | Post-submit confirmation + WhatsApp CTA     |
| `pages/InquiryPage.jsx`                    | `/inquiry` — form + contact sidebar         |
