import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../api/auth.api";

/**
 * Wraps `forgotPassword` (Firebase `sendPasswordResetEmail`) in a mutation.
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email) => forgotPassword(email),
  });
}
