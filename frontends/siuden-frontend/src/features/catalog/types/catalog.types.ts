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

export interface ProductDetail {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  seoTitle: string | null;
  seoDescription: string | null;
  variants: ProductVariant[];
  categories: ProductCategory[];
  images: ProductImage[];
}

export interface ProductVariant {
  id: number;
  variantName: string;
  sku: string | null;
  stock: number;
  price: number;
}

export interface ProductCategory {
  categoryId: string;
  name: string;
  slug: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductImage {
  id: number;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
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
  brandName: string;
  contactEmail: string;
  phone: string;
  addressLine: string;
  addressNumber: string;
  city: string;
  province: string;
  postalCode: string;
  countryCode: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  borderRadius: string;
  announcementEnabled: boolean;
  announcementText: string;
  announcementUrl: string | null;
  faviconUrl: string | null;
  logoUrl: string | null;
}

export const productSort = {
  newest: 1,
  oldest: 2,
  priceAsc: 3,
  priceDesc: 4,
} as const;

export type ProductSort = (typeof productSort)[keyof typeof productSort];
