import type { InventoryService } from "@/features/inventory/types/contracts";
import { type HttpRequest } from "@/services/http-services";
import { page, params } from "@/services/http-utils";

export function createInventoryApi(request: HttpRequest): InventoryService {

  return {
    listLocations: () => request("/inventory/locations"),
    async list(filters = {}) {
      return page(
        await request(
          `/inventory/balances${params({ page: filters.page ?? 1, limit: filters.pageSize ?? 20, search: filters.search, categoryId: filters.categoryId, stockLocationId: filters.stockLocationId, status: filters.status })}`,
        ),
      );
    },
    async listMovements(filters = {}) {
      return page(
        await request(
          `/inventory/movements${params({ page: filters.page ?? 1, limit: filters.pageSize ?? 20, search: filters.search, stockLocationId: filters.stockLocationId, movementType: filters.type, from: filters.from, to: filters.to })}`,
        ),
      );
    },
    adjust: (input) =>
      request("/inventory/movements", {
        method: "POST",
        body: JSON.stringify({
          stockLocationId: input.stockLocationId,
          movementType: input.type,
          reason: input.reason,
          items: input.items,
        }),
      }),
  };
}
