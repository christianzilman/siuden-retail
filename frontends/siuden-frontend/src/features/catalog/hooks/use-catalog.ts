import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getProduct,
  getProducts,
  getPublicTenant,
} from "../api/catalog.api";
import type { ProductSort } from "../types/catalog.types";
import { normalizeCategoryTree } from "../utils/catalog.utils";

export function usePublicTenant(tenantSlug: string) {
  return useQuery({
    queryKey: ["public-tenant", tenantSlug],
    queryFn: () => getPublicTenant(tenantSlug),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(tenantSlug: string, productSlug: string) {
  return useQuery({
    queryKey: ["storefront-product", tenantSlug, productSlug],
    queryFn: () => getProduct(tenantSlug, productSlug),
    enabled: Boolean(tenantSlug && productSlug),
    staleTime: 60 * 1000,
  });
}

export function useCategories(tenantSlug: string) {
  return useQuery({
    queryKey: ["storefront-categories", tenantSlug],
    queryFn: () => getCategories(tenantSlug),
    select: normalizeCategoryTree,
    staleTime: 5 * 60 * 1000,
  });
}

interface UseProductsOptions {
  categoryId?: string;
  enabled?: boolean;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: ProductSort;
}

export function useProducts(
  tenantSlug: string,
  {
    categoryId,
    enabled = true,
    pageNumber = 1,
    pageSize = 12,
    sortBy = 1,
  }: UseProductsOptions = {},
) {
  return useQuery({
    queryKey: [
      "storefront-products",
      tenantSlug,
      categoryId ?? "all",
      sortBy,
      pageNumber,
      pageSize,
    ],
    queryFn: () =>
      getProducts(tenantSlug, { categoryId, pageNumber, pageSize, sortBy }),
    enabled,
    placeholderData: (previousData) => previousData,
    staleTime: 60 * 1000,
  });
}
