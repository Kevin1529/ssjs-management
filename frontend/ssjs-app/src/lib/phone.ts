const MOBILE_PATTERN = /^\+[1-9]\d{7,14}$/;
const OTP_PATTERN = /^\d{6}$/;

export const DEFAULT_COUNTRY_CODE = "+91";
export const OTP_LENGTH = 6;

/** Removes spaces and dashes so "+91 98765-43210" becomes "+919876543210". */
export function normalizeMobileNumber(value: string) {
  return value.replace(/[\s-]/g, "");
}

export function isValidMobileNumber(value: string) {
  return MOBILE_PATTERN.test(value);
}

export function isValidOtp(value: string) {
  return OTP_PATTERN.test(value);
}

export function sanitizeOtp(value: string) {
  return value.replace(/\D/g, "").slice(0, OTP_LENGTH);
}
