const API_URL = process.env.NEXT_PUBLIC_API_URL;

let pendingRequests = 0;
const loadingListeners = new Set<() => void>();

function notifyLoadingListeners() {
  loadingListeners.forEach((listener) => listener());
}

export function subscribeToApiLoading(listener: () => void) {
  loadingListeners.add(listener);
  return () => loadingListeners.delete(listener);
}

export function getApiLoadingSnapshot() {
  return pendingRequests > 0;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const headers = new Headers(options.headers);

  // Let the browser set the multipart boundary for FormData uploads.
  if (typeof options.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  pendingRequests += 1;
  notifyLoadingListeners();

  try {
    const baseUrl = API_URL.replace(/\/+$/, "");
    const endpoint = path.replace(/^\/+/, "");

    const response = await fetch(`${baseUrl}/${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    if (response.status === 204) {
      return undefined as T;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      throw new Error("The API returned an unexpected response.");
    }

    const data: unknown = await response.json();

    if (!response.ok) {
      const message =
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string"
          ? data.message
          : `Request failed with status ${response.status}.`;

      throw new Error(message);
    }

    return data as T;
  } finally {
    pendingRequests -= 1;
    notifyLoadingListeners();
  }
}
