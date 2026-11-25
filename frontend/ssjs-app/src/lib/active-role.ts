export type ActiveRole = "user" | "admin";

const activeRoleEvent = "active-role-change";

export function getActiveRole(): ActiveRole | null {
  if (typeof window === "undefined") {
    return null;
  }

  const role = window.localStorage.getItem("activeRole");
  return role === "user" || role === "admin" ? role : null;
}

export function subscribeToActiveRole(listener: () => void) {
  window.addEventListener(activeRoleEvent, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(activeRoleEvent, listener);
    window.removeEventListener("storage", listener);
  };
}

export function setActiveRole(role: ActiveRole | null) {
  if (role) {
    window.localStorage.setItem("activeRole", role);
  } else {
    window.localStorage.removeItem("activeRole");
  }

  window.dispatchEvent(new Event(activeRoleEvent));
}
