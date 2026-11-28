import { trackRequest } from "@/lib/api-loading";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];

let csrfTokenCache: string | null = null;
let csrfTokenRequest: Promise<string> | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getBaseUrl() {
  if (!API_URL) throw new Error("API URL is not configured.");
  return API_URL.replace(/\/+$/, "");
}

async function fetchCsrfToken(): Promise<string> {
  const response = await fetch(`${getBaseUrl()}/auth/csrf`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Unable to initialize request security.");

  const data: unknown = await response.json();
  if (!isRecord(data) || typeof data.csrfToken !== "string") {
    throw new Error("The server did not return a valid security token.");
  }

  return data.csrfToken;
}

/** Returns a cached CSRF token, sharing one in-flight request between callers. */
async function getCsrfToken(): Promise<string> {
  if (csrfTokenCache) return csrfTokenCache;

  csrfTokenRequest ??= fetchCsrfToken();

  try {
    csrfTokenCache = await csrfTokenRequest;
    return csrfTokenCache;
  } finally {
    csrfTokenRequest = null;
  }
}

function resetCsrfToken() {
  csrfTokenCache = null;
  csrfTokenRequest = null;
}

function isJson(response: Response) {
  return Boolean(response.headers.get("content-type")?.includes("application/json"));
}

async function isCsrfFailure(response: Response) {
  if (response.status !== 403 || !isJson(response)) return false;

  const body: unknown = await response.clone().json();
  return isRecord(body) && body.code === "CSRF_VALIDATION_FAILED";
}

function getResponseMessage(data: unknown, status: number) {
  return isRecord(data) && typeof data.message === "string"
    ? data.message
    : `Request failed with status ${status}.`;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const baseUrl = getBaseUrl();
  const endpoint = path.replace(/^\/+/, "");
  const method = (options.method || "GET").toUpperCase();
  const requiresCsrf = !SAFE_METHODS.includes(method);

  const headers = new Headers(options.headers);
  // Strings are JSON; FormData must keep the browser-set multipart boundary.
  if (typeof options.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const send = (csrfToken?: string) => {
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

  return trackRequest(async () => {
    let response = await send(requiresCsrf ? await getCsrfToken() : undefined);

    if (requiresCsrf && (await isCsrfFailure(response))) {
      resetCsrfToken();
      response = await send(await getCsrfToken());
    }

    if (response.status === 204) return undefined as T;

    if (!isJson(response)) {
      throw new Error("The API returned an unexpected response.");
    }

    const data: unknown = await response.json();
    if (!response.ok) throw new Error(getResponseMessage(data, response.status));

    return data as T;
  });
}
