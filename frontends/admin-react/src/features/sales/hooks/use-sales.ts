import { useTenant } from "@/features/auth/hooks/use-auth";
import type { SaleFilters } from "@/features/sales/types/contracts";
import { errorMessage } from "@/lib/error-message";
import { queryKeys } from "@/lib/query-keys";
import { services } from "@/services";
import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export async function invalidateSaleEffects(queryClient: QueryClient, tenantId: string) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["sales", tenantId] }),
    queryClient.invalidateQueries({ queryKey: ["inventory", tenantId] }),
    queryClient.invalidateQueries({ queryKey: ["stock-movements", tenantId] }),
    queryClient.invalidateQueries({ queryKey: ["products", tenantId] }),
    queryClient.invalidateQueries({ queryKey: ["customers", tenantId] }),
    queryClient.invalidateQueries({ queryKey: ["dashboard", tenantId] }),
  ]);
}

export function useSalesQuery(filters: SaleFilters = {}) {
  const tenant = useTenant();
  return useQuery({
    queryKey: queryKeys.sales(tenant.tenantId, filters),
    queryFn: () => services.sales.list(filters),
    enabled: tenant.enabled,
  });
}

export function useSaleQuery(saleId: string | undefined) {
  const tenant = useTenant();
  return useQuery({
    queryKey: queryKeys.sale(tenant.tenantId, saleId ?? ""),
    queryFn: () => services.sales.get(saleId ?? ""),
    enabled: tenant.enabled && Boolean(saleId),
  });
}

export function useSaleMutations() {
  const queryClient = useQueryClient();
  const { tenantId } = useTenant();
  return {
    confirm: useMutation({
      mutationFn: services.sales.confirm,
      onSuccess: async () => {
        await invalidateSaleEffects(queryClient, tenantId);
        toast.success("Venta confirmada");
      },
      onError: (error) => toast.error(errorMessage(error)),
    }),
    cancel: useMutation({
      mutationFn: ({ saleId, reason }: { saleId: string; reason?: string }) =>
        services.sales.cancel(saleId, { reason }),
      onSuccess: async ({ sale }) => {
        queryClient.setQueryData(queryKeys.sale(tenantId, sale.id), sale);
        await invalidateSaleEffects(queryClient, tenantId);
        toast.success("Venta cancelada y stock reintegrado");
      },
      onError: (error) => toast.error(errorMessage(error)),
    }),
  };
}
