import type { ISODateString } from "@/types/common";

export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type SellingMode = "DIRECT" | "INQUIRY_ONLY";

export interface ProductImage {
  id: string;
  tenantId: string;
  productId: string;
  productVariantId: string | null;
  mediaAssetId: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductOptionValue {
  id: string;
  tenantId: string;
  productOptionId: string;
  value: string;
  sortOrder: number;
}

export interface ProductOption {
  id: string;
  tenantId: string;
  productId: string;
  name: string;
  sortOrder: number;
  values: ProductOptionValue[];
}

export interface ProductDimensions {
  weightKg?: number;
  heightCm?: number;
  widthCm?: number;
  depthCm?: number;
}

export interface ProductVariant {
  id: string;
  tenantId: string;
  productId: string;
  name: string;
  sku: string | null;
  barcode: string | null;
  price: number | null;
  compareAtPrice: number | null;
  cost: number | null;
  selectedOptionValueIds: string[];
  dimensions: ProductDimensions;
  trackInventory: boolean;
  allowBackorder: boolean;
  isDefault: boolean;
  enabled: boolean;
  sortOrder: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt: ISODateString | null;
}

export interface ProductCategoryAssignment {
  categoryId: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description: string | null;
  status: ProductStatus;
  sellingMode: SellingMode;
  seoTitle: string | null;
  seoDescription: string | null;
  categoryAssignments: ProductCategoryAssignment[];
  options: ProductOption[];
  images: ProductImage[];
  variants: ProductVariant[];
  publishedAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt: ISODateString | null;
}
