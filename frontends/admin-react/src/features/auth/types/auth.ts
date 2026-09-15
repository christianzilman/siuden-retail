import type { Account, AccountMemberStatus } from "@/features/accounts/types/accounts";

export type UserRole = "PLATFORM_ADMIN" | "OWNER" | "ADMIN" | "SELLER" | "STOCK_MANAGER";

export type UserStatus = "PENDING" | "ACTIVE" | "BLOCKED" | "DISABLED";

export type TenantStatus = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export type PermissionCode =
  | "store.read"
  | "store.update"
  | "store.theme.update"
  | "products.read"
  | "products.write"
  | "categories.write"
  | "inventory.read"
  | "inventory.adjust"
  | "customers.read"
  | "customers.write"
  | "sales.read"
  | "sales.create"
  | "sales.cancel"
  | "pos.use"
  | "orders.manage"
  | "users.manage"
  | "roles.manage"
  | "purchases.read"
  | "purchases.write"
  | "accounts.manage";

export type TenantFeatureCode =
  | "CATALOG"
  | "INVENTORY"
  | "CUSTOMERS"
  | "SALES"
  | "POS"
  | "PURCHASES"
  | "ONLINE_ORDERS"
  | "ONLINE_PAYMENTS"
  | "SHIPPING"
  | "INVOICING";

export interface User {
  id: string;
  email: string;
  displayName: string;
  status: UserStatus;
}

export interface Role {
  id: string;
  accountId: string;
  code: UserRole;
  name: string;
  description: string | null;
  isSystem: boolean;
  permissions: PermissionCode[];
}

export interface Tenant {
  id: string;
  accountId: string;
  name: string;
  slug: string;
  status: TenantStatus;
  defaultCurrency: string;
  timeZone: string;
  enabled: boolean;
  enabledFeatures: TenantFeatureCode[];
}

export interface AuthSession {
  user: Pick<User, "id" | "email" | "displayName">;
  account: Account;
  membership: {
    id: string;
    role: UserRole;
    status: AccountMemberStatus;
    permissions: PermissionCode[];
  };
  tenant: Pick<
    Tenant,
    | "id"
    | "accountId"
    | "slug"
    | "name"
    | "status"
    | "defaultCurrency"
    | "timeZone"
    | "enabled"
    | "enabledFeatures"
  > & {
    logoUrl?: string;
    primaryColor: string;
  };
}
