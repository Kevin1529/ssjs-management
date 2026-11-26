export type ActiveRole = "user" | "admin";

const activeRoleEvent = "active-role-change";

export function getActiveRole(): ActiveRole | null {
  if (typeof window === "undefined") {
    return null;
  }

  const role = window.sessionStorage.getItem("activeRole");
  return role === "user" || role === "admin" ? role : null;
}

export function subscribeToActiveRole(listener: () => void) {
  window.addEventListener(activeRoleEvent, listener);

  return () => {
    window.removeEventListener(activeRoleEvent, listener);
  };
}

export function setActiveRole(role: ActiveRole | null) {
  if (role) {
    window.sessionStorage.setItem("activeRole", role);
  } else {
    window.sessionStorage.removeItem("activeRole");
  }

  window.dispatchEvent(new Event(activeRoleEvent));
}
