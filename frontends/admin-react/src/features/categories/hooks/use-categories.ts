import { useTenant } from "@/features/auth/hooks/use-auth";
import type { CategoryOrderInput, CreateCategoryInput, UpdateCategoryInput } from "@/features/categories/types/contracts";
import { errorMessage } from "@/lib/error-message";
import { queryKeys } from "@/lib/query-keys";
import { services } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCategoriesQuery() {
  const tenant = useTenant();
  return useQuery({
    queryKey: queryKeys.categories(tenant.tenantId),
    queryFn: () => services.categories.list({ includeHidden: true }),
    enabled: tenant.enabled,
  });
}

export function useCategoryMutations() {
  const queryClient = useQueryClient();
  const { tenantId } = useTenant();
  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.categories(tenantId) }),
      queryClient.invalidateQueries({ queryKey: ["products", tenantId] }),
    ]);
  return {
    create: useMutation({
      mutationFn: (input: CreateCategoryInput) => services.categories.create(input),
      onSuccess: async () => {
        await invalidate();
        toast.success("Categoría creada");
      },
      onError: (error) => toast.error(errorMessage(error)),
    }),
    update: useMutation({
      mutationFn: ({ id, input }: { id: string; input: UpdateCategoryInput }) =>
        services.categories.update(id, input),
      onSuccess: async () => {
        await invalidate();
        toast.success("Categoría actualizada");
      },
      onError: (error) => toast.error(errorMessage(error)),
    }),
    remove: useMutation({
      mutationFn: (id: string) => services.categories.delete(id),
      onSuccess: async () => {
        await invalidate();
        toast.success("Categoría eliminada");
      },
      onError: (error) => toast.error(errorMessage(error)),
    }),
    reorder: useMutation({
      mutationFn: (input: CategoryOrderInput[]) => services.categories.reorder(input),
      onSuccess: async () => {
        await invalidate();
        toast.success("Orden de categorías actualizado");
      },
      onError: (error) => toast.error(errorMessage(error)),
    }),
  };
}
