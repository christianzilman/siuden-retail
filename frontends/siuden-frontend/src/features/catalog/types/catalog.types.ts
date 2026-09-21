export interface Category {
  id: string;
  children: Category[];
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  isVisible: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  createdAt: string;
}

export interface PagedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PublicTenant {
  id: string;
  slug: string;
  name: string;
}

export const productSort = {
  newest: 1,
  oldest: 2,
  priceAsc: 3,
  priceDesc: 4,
} as const;

export type ProductSort = (typeof productSort)[keyof typeof productSort];
