import type { AuthSession, PermissionCode, TenantFeatureCode, UserRole } from "@/features/auth/types/auth";
import type { AuthService } from "@/features/auth/types/contracts";
import { HttpServiceError, type HttpRequest } from "@/services/http-services";

type ApiSession = {
  user: AuthSession["user"];
  account: AuthSession["account"];
  membership: {
    id: string;
    role: string;
    status: AuthSession["membership"]["status"];
    permissions: string[];
  };
  tenant: Omit<AuthSession["tenant"], "enabledFeatures" | "primaryColor">;
};

function enabledFeatures(permissions: string[]): TenantFeatureCode[] {
  const features: TenantFeatureCode[] = [];
  if (
    permissions.some(
      (value) => value.startsWith("products") || value.startsWith("categories"),
    )
  )
    features.push("CATALOG");
  if (permissions.some((value) => value.startsWith("inventory")))
    features.push("INVENTORY");
  if (permissions.some((value) => value.startsWith("customers")))
    features.push("CUSTOMERS");
  if (permissions.some((value) => value.startsWith("sales")))
    features.push("SALES");
  if (permissions.includes("pos.use")) features.push("POS");
  if (permissions.some((value) => value.startsWith("purchases")))
    features.push("PURCHASES");
  return features;
}

function normalizeSession(session: ApiSession): AuthSession {
  return {
    user: session.user,
    account: session.account,
    membership: {
      ...session.membership,
      role: session.membership.role as UserRole,
      permissions: session.membership.permissions as PermissionCode[],
    },
    tenant: {
      ...session.tenant,
      enabledFeatures: enabledFeatures(session.membership.permissions),
      primaryColor: "#7f2942",
    },
  };
}
export function createAuthApi(request: HttpRequest): AuthService {

  return {
    async login(input) {
      return normalizeSession(
        (
          await request<{ session: ApiSession }>("/auth/login", {
            method: "POST",
            body: JSON.stringify(input),
          })
        ).session,
      );
    },
    async me() {
      try {
        return normalizeSession(await request<ApiSession>("/auth/me"));
      } catch (error) {
        if (error instanceof HttpServiceError && error.status === 401)
          return null;
        throw error;
      }
    },
    logout: () => request<void>("/auth/logout", { method: "POST" }),
  };
}
