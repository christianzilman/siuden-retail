import { api, refreshAuthentication } from "@/services/http-client";
import type {
  LoginValues,
  RegisterValues,
} from "../validations/auth.validation";
import type { LoginResult } from "../types/auth.types";

export async function loginCustomer(tenantSlug: string, values: LoginValues) {
  const response = await api.post<LoginResult>(
    `/api/tenants/${tenantSlug}/auth/customer/login`,
    values,
  );
  return response.data;
}

export async function registerCustomer(
  tenantSlug: string,
  values: RegisterValues,
) {
  await api.post(`/api/tenants/${tenantSlug}/customers`, values);
}

export async function refreshSession() {
  return refreshAuthentication();
}

export async function logout() {
  await api.post("/api/auth/logout");
}
