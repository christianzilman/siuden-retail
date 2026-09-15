import type { Account } from "@/features/accounts/types/accounts";
import type { PaginatedResult } from "@/types/common";
import type { PageInput } from "@/types/service";

export interface AccountWithTenants extends Account {
  tenants: Array<{
    id: string;
    accountId: string;
    name: string;
    slug: string;
    status: string;
    defaultCurrency: string;
    timeZone: string;
    enabled: boolean;
  }>;
}

export interface AccountFilters extends PageInput {
  search?: string;
}

export interface CreateAccountInput {
  accountName: string;
  tenantName: string;
  slug: string;
  defaultCurrency?: string;
  timeZone?: string;
  owner?: {
    email: string;
    password: string;
    displayName: string;
  };
}

export interface AccountService {
  list(filters?: AccountFilters): Promise<PaginatedResult<AccountWithTenants>>;
  create(input: CreateAccountInput): Promise<AccountWithTenants>;
}
