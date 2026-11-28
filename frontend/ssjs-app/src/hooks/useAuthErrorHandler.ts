"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { getErrorMessage, isAuthError } from "@/lib/errors";

/**
 * Returns a handler that turns a thrown value into a display message.
 * If the error means the session expired it redirects to `loginPath`
 * and returns null, so callers can skip showing an error.
 */
export function useAuthErrorHandler(loginPath: string) {
  const router = useRouter();

  return useCallback(
    (error: unknown, fallback: string): string | null => {
      const message = getErrorMessage(error, fallback);

      if (isAuthError(message)) {
        router.replace(loginPath);
        return null;
      }

      return message;
    },
    [router, loginPath],
  );
}
