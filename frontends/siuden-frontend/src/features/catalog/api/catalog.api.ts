import { api } from "@/services/http-client";
import type {
  Category,
  PagedResponse,
  Product,
  ProductSort,
  PublicTenant,
} from "../types/catalog.types";

export async function getPublicTenant(tenantSlug: string) {
  const response = await api.get<PublicTenant>(`/api/tenants/${tenantSlug}`);
  return response.data;
}

export async function getCategories(tenantSlug: string) {
  const response = await api.get<Category[]>(`/api/categories/${tenantSlug}`);
  return response.data;
}

interface GetProductsOptions {
  categoryId?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: ProductSort;
}

export async function getProducts(
  tenantSlug: string,
  {
    categoryId,
    pageNumber = 1,
    pageSize = 12,
    sortBy = 1,
  }: GetProductsOptions = {},
) {
  const response = await api.get<PagedResponse<Product>>(
    `/api/products/${tenantSlug}`,
    {
      params: {
        CategoryId: categoryId,
        SortBy: sortBy,
        "Paging.PageNumber": pageNumber,
        "Paging.PageSize": pageSize,
      },
    },
  );

  return response.data;
}
