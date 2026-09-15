import type { StorefrontLoginInput, StorefrontRegisterInput, StorefrontSession } from "@/features/auth/types/auth";
import { request } from "@/lib/http-client";

export async function registerStorefrontCustomer(
  input: StorefrontRegisterInput,
): Promise<StorefrontSession> {
  const response = await request<{ session: StorefrontSession }>(
    "/storefront/auth/register",
    { method: "POST", body: JSON.stringify(input) },
  );
  return response.session;
}

export async function loginStorefrontCustomer(
  input: StorefrontLoginInput,
): Promise<StorefrontSession> {
  const response = await request<{ session: StorefrontSession }>(
    "/storefront/auth/login",
    { method: "POST", body: JSON.stringify(input) },
  );
  return response.session;
}

export async function getStorefrontSession(): Promise<StorefrontSession | null> {
  try {
    return await request<StorefrontSession>("/storefront/auth/me");
  } catch {
    return null;
  }
}

export async function logoutStorefrontCustomer(): Promise<void> {
  await request<{ message: string }>("/storefront/auth/logout", {
    method: "POST",
  });
}
