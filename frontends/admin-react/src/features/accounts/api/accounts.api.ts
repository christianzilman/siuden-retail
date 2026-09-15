import type { AccountFilters, AccountService, AccountWithTenants, CreateAccountInput } from "@/features/accounts/types/contracts";
import { type HttpRequest } from "@/services/http-services";
import { page, params, type ApiPage } from "@/services/http-utils";

export function createAccountsApi(request: HttpRequest): AccountService {

  return {
    async list(filters: AccountFilters = {}) {
      return page(
        await request<ApiPage<AccountWithTenants>>(
          `/accounts${params({ page: filters.page ?? 1, limit: filters.pageSize ?? 20, search: filters.search })}`,
        ),
      );
    },
    create: (input: CreateAccountInput) =>
      request("/accounts", { method: "POST", body: JSON.stringify(input) }),
  };
}
