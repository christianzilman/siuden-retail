import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { LoginResult } from "@/features/auth/types/auth.types";

const clientOptions = {
  baseURL: import.meta.env.VITE_API_URL ?? "/",
  withCredentials: true,
};

export const api = axios.create(clientOptions);
const refreshClient = axios.create(clientOptions);

let refreshRequest: Promise<LoginResult> | null = null;

export function refreshAuthentication() {
  if (!refreshRequest) {
    refreshRequest = refreshClient
      .post<LoginResult>("/api/auth/refresh")
      .then((response) => response.data)
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
}

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _authRetry?: boolean;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetryableRequestConfig | undefined;
    const accessToken = useAuthStore.getState().accessToken;
    const url = request?.url ?? "";
    const skipsAutomaticRefresh =
      url.endsWith("/api/auth/refresh") ||
      url.endsWith("/api/auth/logout") ||
      url.includes("/auth/customer/login") ||
      url.includes("/auth/staff/login");

    if (
      error.response?.status !== 401 ||
      !request ||
      request._authRetry ||
      !accessToken ||
      skipsAutomaticRefresh
    ) {
      return Promise.reject(error);
    }

    request._authRetry = true;

    try {
      const result = await refreshAuthentication();
      useAuthStore.getState().setAuthenticated(result);
      return api(request);
    } catch {
      useAuthStore.getState().setAnonymous();
      return Promise.reject(error);
    }
  },
);
