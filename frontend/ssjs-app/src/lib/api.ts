
const API_URL = process.env.NEXT_PUBLIC_API_URL;

let pendingRequests = 0;

const loadingListeners = new Set<() => void>();

function notifyLoadingListeners() {
  loadingListeners.forEach((listener) => listener());
}

export function subscribeToApiLoading(listener: () => void) {
  loadingListeners.add(listener);

  return () => {
    loadingListeners.delete(listener);
  };
}

export function getApiLoadingSnapshot() {
  return pendingRequests > 0;
}

type ApiOptions = RequestInit & {
  tokenKey?: "userToken" | "adminToken";
};

export async function apiRequest<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const { tokenKey, ...requestOptions } = options;

  const headers = new Headers(requestOptions.headers);

  // Set JSON content type when sending a JSON string
  if (
    typeof requestOptions.body === "string" &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  // Attach user or admin token
  if (tokenKey && typeof window !== "undefined") {
    const token = localStorage.getItem(tokenKey);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  // Track API loading state
  pendingRequests += 1;
  notifyLoadingListeners();

  try {
    const baseUrl = API_URL.replace(/\/+$/, "");
    const endpoint = path.replace(/^\/+/, "");

    const response = await fetch(`${baseUrl}/${endpoint}`, {
      ...requestOptions,
      headers,
    });

    // Handle empty response
    if (response.status === 204) {
      return undefined as T;
    }

    const contentType = response.headers.get("content-type");

    // Validate JSON response
    if (!contentType?.includes("application/json")) {
      throw new Error("The API returned an unexpected response.");
    }

    const data: unknown = await response.json();

    // Handle API errors
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
