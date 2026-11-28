const AUTH_ERROR_PATTERN = /token|session|authentication|unauthorized|login/i;

export function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

/** True when an API error message means the session is missing or expired. */
export function isAuthError(message: string) {
  return AUTH_ERROR_PATTERN.test(message);
}
