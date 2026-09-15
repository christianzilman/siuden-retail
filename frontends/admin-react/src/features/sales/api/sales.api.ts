import type { SaleService } from "@/features/sales/types/contracts";
import { type HttpRequest } from "@/services/http-services";
import { page, params } from "@/services/http-utils";

export function createSalesApi(request: HttpRequest): SaleService {

  return {
    async list(filters = {}) {
      return page(
        await request(
          `/sales${params({ page: filters.page ?? 1, limit: filters.pageSize ?? 20, search: filters.search, status: filters.status, channel: filters.channel, customerId: filters.customerId, from: filters.from, to: filters.to })}`,
        ),
      );
    },
    get: (id) => request(`/sales/${id}`),
    confirm: (input) =>
      request("/sales", { method: "POST", body: JSON.stringify(input) }),
    cancel: (id, input = {}) =>
      request(`/sales/${id}/cancel`, {
        method: "POST",
        body: JSON.stringify(input),
      }),
  };
}
