import { useTenant } from "@/features/auth/hooks/use-auth";
import type { CreateCustomerInput, CustomerFilters, UpdateCustomerInput } from "@/features/customers/types/contracts";
import type { CustomerStatus } from "@/features/customers/types/customers";
import { errorMessage } from "@/lib/error-message";
import { queryKeys } from "@/lib/query-keys";
import { services } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCustomersQuery(filters: CustomerFilters = {}) {
  const tenant = useTenant();
  return useQuery({
    queryKey: queryKeys.customers(tenant.tenantId, filters),
    queryFn: () => services.customers.list(filters),
    enabled: tenant.enabled,
  });
}

export function useCustomerQuery(customerId: string | undefined) {
  const tenant = useTenant();
  return useQuery({
    queryKey: queryKeys.customer(tenant.tenantId, customerId ?? ""),
    queryFn: () => services.customers.get(customerId ?? ""),
    enabled: tenant.enabled && Boolean(customerId),
  });
}

export function useCustomerMutations(customerId?: string) {
  const queryClient = useQueryClient();
  const { tenantId } = useTenant();
  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["customers", tenantId] });
    if (customerId) {
      await queryClient.invalidateQueries({ queryKey: queryKeys.customer(tenantId, customerId) });
    }
  };
  return {
    create: useMutation({
      mutationFn: (input: CreateCustomerInput) => services.customers.create(input),
      onSuccess: async () => {
        await refresh();
        toast.success("Cliente creado");
      },
      onError: (error) => toast.error(errorMessage(error)),
    }),
    update: useMutation({
      mutationFn: (input: UpdateCustomerInput) => {
        if (!customerId) throw new Error("Cliente inválido");
        return services.customers.update(customerId, input);
      },
      onSuccess: async () => {
        await refresh();
        toast.success("Cliente actualizado");
      },
      onError: (error) => toast.error(errorMessage(error)),
    }),
    setStatus: useMutation({
      mutationFn: (status: CustomerStatus) => {
        if (!customerId) throw new Error("Cliente inválido");
        return services.customers.setStatus(customerId, status);
      },
      onSuccess: async () => {
        await refresh();
        toast.success("Estado del cliente actualizado");
      },
      onError: (error) => toast.error(errorMessage(error)),
    }),
  };
}
