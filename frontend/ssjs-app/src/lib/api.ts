const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(
    `${API_URL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`,
    {
      ...options,
      headers,
    },
  );

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error("The API returned an invalid JSON response.");
  }

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
}
