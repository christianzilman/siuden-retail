import { useTenant } from "@/features/auth/hooks/use-auth";
import type { InventoryAdjustmentInput, InventoryFilters, StockMovementFilters } from "@/features/inventory/types/contracts";
import { errorMessage } from "@/lib/error-message";
import { queryKeys } from "@/lib/query-keys";
import { services } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useInventoryQuery(filters: InventoryFilters = {}) {
  const tenant = useTenant();
  return useQuery({
    queryKey: queryKeys.inventory(tenant.tenantId, filters),
    queryFn: () => services.inventory.list(filters),
    enabled: tenant.enabled,
  });
}

export function useStockLocationsQuery() {
  const tenant = useTenant();
  return useQuery({
    queryKey: ["stock-locations", tenant.tenantId],
    queryFn: () => services.inventory.listLocations(),
    enabled: tenant.enabled,
  });
}

export function useMovementsQuery(filters: StockMovementFilters = {}) {
  const tenant = useTenant();
  return useQuery({
    queryKey: queryKeys.stockMovements(tenant.tenantId, filters),
    queryFn: () => services.inventory.listMovements(filters),
    enabled: tenant.enabled,
  });
}

export function useInventoryAdjustmentMutation() {
  const queryClient = useQueryClient();
  const { tenantId } = useTenant();
  return useMutation({
    mutationFn: (input: InventoryAdjustmentInput) => services.inventory.adjust(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["inventory", tenantId] }),
        queryClient.invalidateQueries({ queryKey: ["stock-movements", tenantId] }),
        queryClient.invalidateQueries({ queryKey: ["products", tenantId] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard", tenantId] }),
      ]);
      toast.success("Stock actualizado");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}
