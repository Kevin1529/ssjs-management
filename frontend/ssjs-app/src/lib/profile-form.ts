import { DEFAULT_COUNTRY } from "@/constants/profile";
import { todayISODate } from "@/lib/date-format";
import type { ProfilePayload, User } from "@/types/user";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EMPTY_PROFILE_FORM: ProfilePayload = {
  fullName: "",
  email: "",
  dateOfBirth: "",
  gender: "MALE",
  address: {
    addressLine: "",
    city: "",
    state: "",
    country: DEFAULT_COUNTRY,
    pincode: "",
  },
  profilePhoto: "",
  documents: [],
};

/** Maps an API user onto the editable form shape. */
export function profileToForm(user?: User | null): ProfilePayload {
  if (!user) return EMPTY_PROFILE_FORM;

  return {
    fullName: user.fullName || "",
    email: user.email || "",
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
    gender: user.gender || "MALE",
    address: {
      addressLine: user.address?.addressLine || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      country: user.address?.country || DEFAULT_COUNTRY,
      pincode: user.address?.pincode || "",
    },
    profilePhoto: user.profilePhoto || "",
    documents: user.documents || [],
  };
}

/** Trims text fields before sending to the API. */
export function normalizeProfile(form: ProfilePayload): ProfilePayload {
  return { ...form, fullName: form.fullName.trim(), email: form.email.trim() };
}

/** Returns the first validation error, or null when the form is valid. */
export function validateProfileForm(form: ProfilePayload): string | null {
  if (!form.fullName.trim()) return "Please enter your full name.";
  if (!EMAIL_PATTERN.test(form.email.trim())) {
    return "Please enter a valid email address.";
  }
  if (!form.dateOfBirth) return "Please select your date of birth.";
  if (form.dateOfBirth >= todayISODate()) {
    return "Date of birth must be in the past.";
  }

  const { addressLine, city, state, country, pincode } = form.address;
  if (![addressLine, city, state, country, pincode].every((v) => v.trim())) {
    return "Please complete all address fields.";
  }

  return null;
}
