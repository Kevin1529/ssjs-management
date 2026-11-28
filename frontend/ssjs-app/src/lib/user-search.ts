import type { User } from "@/types/user";

/** Case-insensitive match on name, mobile number or email. */
export function matchesUserSearch(user: User, term: string) {
  const needle = term.trim().toLowerCase();
  if (!needle) return true;

  return [user.fullName, user.mobileNumber, user.email].some((value) =>
    value?.toLowerCase().includes(needle),
  );
}
