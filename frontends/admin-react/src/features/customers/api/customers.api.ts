import type { CustomerService } from "@/features/customers/types/contracts";
import { type HttpRequest } from "@/services/http-services";
import { page, params } from "@/services/http-utils";

export function createCustomersApi(request: HttpRequest): CustomerService {

  return {
    async list(filters = {}) {
      return page(
        await request(
          `/customers${params({ page: filters.page ?? 1, limit: filters.pageSize ?? 20, search: filters.search, status: filters.status, kind: filters.kind, source: filters.source })}`,
        ),
      );
    },
    get: (id) => request(`/customers/${id}`),
    create: (input) =>
      request("/customers", { method: "POST", body: JSON.stringify(input) }),
    update: (id, input) =>
      request(`/customers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input),
      }),
    setStatus: (id, status) =>
      request(`/customers/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
  };
}
