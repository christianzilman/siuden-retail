import axios from "axios";

type ApiErrorPayload = { message?: string[] | string };

export class HttpServiceError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "HttpServiceError";
  }
}

export type HttpRequest = <T>(path: string, init?: RequestInit) => Promise<T>;

export function createHttpRequest(): HttpRequest {
  const baseUrl = (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api/v1"
  ).replace(/\/$/, "");
  const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    try {
      const response = await api.request<T>({
        url: path,
        method: init?.method,
        data:
          typeof init?.body === "string" ? JSON.parse(init.body) : init?.body,
      });
      return response.data;
    } catch (error) {
      if (!axios.isAxiosError<ApiErrorPayload>(error)) throw error;
      const payload = error.response?.data;
      const messages = Array.isArray(payload?.message)
        ? payload.message
        : [payload?.message];
      const status = error.response?.status ?? 0;
      throw new HttpServiceError(
        messages.filter(Boolean).join(" ") ||
        (status
          ? `La API respondió con estado ${status}.`
          : "No se pudo conectar con la API."),
        status,
      );
    }
  }
  return request;
}
