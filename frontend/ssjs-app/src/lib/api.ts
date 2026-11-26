const API_URL = process.env.NEXT_PUBLIC_API_URL;

let pendingRequests = 0;
const loadingListeners = new Set<() => void>();
let csrfTokenCache: string | null = null;
let csrfTokenRequest: Promise<string> | null = null;

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

async function getCsrfToken(): Promise<string> {
  if (csrfTokenCache) return csrfTokenCache;
  if (csrfTokenRequest) return csrfTokenRequest;

  if (!API_URL) throw new Error("API URL is not configured.");

  csrfTokenRequest = (async () => {
    const baseUrl = API_URL.replace(/\/+$/, "");
    const response = await fetch(`${baseUrl}/auth/csrf`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Unable to initialize request security.");
    }

    const data: unknown = await response.json();
    if (
      typeof data !== "object" ||
      data === null ||
      !("csrfToken" in data) ||
      typeof data.csrfToken !== "string"
    ) {
      throw new Error("The server did not return a valid security token.");
    }

    csrfTokenCache = data.csrfToken;
    return data.csrfToken;
  })();

  try {
    return await csrfTokenRequest;
  } finally {
    csrfTokenRequest = null;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const headers = new Headers(options.headers);
  const method = (options.method || "GET").toUpperCase();
  const requiresCsrf = !["GET", "HEAD", "OPTIONS"].includes(method);

  // Let the browser set the multipart boundary for FormData uploads.
  if (typeof options.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  pendingRequests += 1;
  notifyLoadingListeners();

  try {
    const baseUrl = API_URL.replace(/\/+$/, "");
    const endpoint = path.replace(/^\/+/, "");

    const sendRequest = (csrfToken?: string) => {
      const requestHeaders = new Headers(headers);
      if (csrfToken) requestHeaders.set("X-CSRF-Token", csrfToken);

      return fetch(`${baseUrl}/${endpoint}`, {
        ...options,
        method,
        headers: requestHeaders,
        credentials: "include",
        cache: options.cache || "no-store",
      });
    };

    let response = await sendRequest(
      requiresCsrf ? await getCsrfToken() : undefined,
    );

    if (requiresCsrf && response.status === 403) {
      const errorData: unknown = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.clone().json()
        : null;
      const isCsrfFailure =
        typeof errorData === "object" &&
        errorData !== null &&
        "code" in errorData &&
        errorData.code === "CSRF_VALIDATION_FAILED";

      if (isCsrfFailure) {
        csrfTokenCache = null;
        csrfTokenRequest = null;
        response = await sendRequest(await getCsrfToken());
      }
    }

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
