import axios from "axios";
import { useAuthStore } from "@/features/auth/store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5112",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});
