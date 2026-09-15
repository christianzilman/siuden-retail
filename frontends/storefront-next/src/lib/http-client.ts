

export type ApiErrorPayload = { message?: string | string[] };

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api/v1";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  if (!response.ok) {
    let payload: ApiErrorPayload | undefined;
    try {
      payload = (await response.json()) as ApiErrorPayload;
    } catch {
      // Preserve the status fallback when the server does not return JSON.
    }
    const messages = Array.isArray(payload?.message)
      ? payload.message
      : [payload?.message];
    throw new Error(
      messages.filter(Boolean).join(" ") ||
      `La API respondió con estado ${response.status}.`,
    );
  }
  return (await response.json()) as T;
}
