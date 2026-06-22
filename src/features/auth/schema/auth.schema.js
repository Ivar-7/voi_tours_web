import { z } from "zod";

// Login/registration validation lives inline in LoginPage/RegisterPage (they
// don't use react-hook-form). forgotPasswordSchema is the one schema with a
// real consumer: ForgotPasswordPage.
export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});
