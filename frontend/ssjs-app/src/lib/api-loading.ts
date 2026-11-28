let pendingRequests = 0;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeToApiLoading(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getApiLoadingSnapshot() {
  return pendingRequests > 0;
}

/** Wraps a request so the global loader tracks it. */
export async function trackRequest<T>(task: () => Promise<T>): Promise<T> {
  pendingRequests += 1;
  notify();

  try {
    return await task();
  } finally {
    pendingRequests -= 1;
    notify();
  }
}
