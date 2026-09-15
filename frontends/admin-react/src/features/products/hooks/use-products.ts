import { useTenant } from "@/features/auth/hooks/use-auth";
import type { BulkPriceAdjustmentInput, CreateProductInput, ProductFilters, UpdateProductInput } from "@/features/products/types/contracts";
import type { ProductStatus } from "@/features/products/types/products";
import { errorMessage } from "@/lib/error-message";
import { queryKeys } from "@/lib/query-keys";
import { services } from "@/services";
import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export async function invalidateProductEffects(queryClient: QueryClient, tenantId: string) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["products", tenantId] }),
    queryClient.invalidateQueries({ queryKey: ["inventory", tenantId] }),
    queryClient.invalidateQueries({ queryKey: ["dashboard", tenantId] }),
  ]);
}

export function useProductsQuery(filters: ProductFilters = {}) {
  const tenant = useTenant();
  return useQuery({
    queryKey: queryKeys.products(tenant.tenantId, filters),
    queryFn: () => services.products.list(filters),
    enabled: tenant.enabled,
  });
}

export function useProductQuery(productId: string | undefined) {
  const tenant = useTenant();
  return useQuery({
    queryKey: queryKeys.product(tenant.tenantId, productId ?? ""),
    queryFn: () => services.products.get(productId ?? ""),
    enabled: tenant.enabled && Boolean(productId),
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  const { tenantId } = useTenant();
  return useMutation({
    mutationFn: (input: CreateProductInput) => services.products.create(input),
    onSuccess: async () => {
      await invalidateProductEffects(queryClient, tenantId);
      await queryClient.invalidateQueries({ queryKey: ["stock-movements", tenantId] });
      toast.success("Producto creado");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}

export function useUpdateProductMutation(productId: string) {
  const queryClient = useQueryClient();
  const { tenantId } = useTenant();
  return useMutation({
    mutationFn: (input: UpdateProductInput) => services.products.update(productId, input),
    onSuccess: async (product) => {
      queryClient.setQueryData(queryKeys.product(tenantId, productId), product);
      await invalidateProductEffects(queryClient, tenantId);
      toast.success("Cambios guardados");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}

export function useProductActionMutations() {
  const queryClient = useQueryClient();
  const { tenantId } = useTenant();
  const complete = async (message: string) => {
    await invalidateProductEffects(queryClient, tenantId);
    toast.success(message);
  };
  return {
    duplicate: useMutation({
      mutationFn: (productId: string) => services.products.duplicate(productId),
      onSuccess: () => complete("Producto duplicado"),
      onError: (error) => toast.error(errorMessage(error)),
    }),
    setStatus: useMutation({
      mutationFn: ({ productId, status }: { productId: string; status: ProductStatus }) =>
        services.products.setStatus(productId, status),
      onSuccess: () => complete("Estado actualizado"),
      onError: (error) => toast.error(errorMessage(error)),
    }),
    archive: useMutation({
      mutationFn: (productId: string) => services.products.delete(productId),
      onSuccess: () => complete("Producto archivado"),
      onError: (error) => toast.error(errorMessage(error)),
    }),
  };
}

export function usePriceAdjustmentMutations() {
  const queryClient = useQueryClient();
  const { tenantId } = useTenant();
  return {
    preview: useMutation({
      mutationFn: (input: BulkPriceAdjustmentInput) =>
        services.products.previewPriceAdjustment(input),
      onError: (error) => toast.error(errorMessage(error)),
    }),
    apply: useMutation({
      mutationFn: (input: BulkPriceAdjustmentInput) =>
        services.products.bulkPriceAdjustment(input),
      onSuccess: async () => {
        await invalidateProductEffects(queryClient, tenantId);
        toast.success("Precios actualizados");
      },
      onError: (error) => toast.error(errorMessage(error)),
    }),
  };
}
