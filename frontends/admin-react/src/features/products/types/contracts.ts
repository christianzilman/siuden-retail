import type { StockMovement } from "@/features/inventory/types/inventory";
import type { Product, ProductCategoryAssignment, ProductDimensions, ProductStatus, SellingMode } from "@/features/products/types/products";
import type { PaginatedResult } from "@/types/common";
import type { PageInput } from "@/types/service";

export interface ProductFilters extends PageInput {
  search?: string;
  categoryId?: string;
  status?: ProductStatus | "ALL";
  stock?: "ALL" | "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "NOT_TRACKED";
  sort?: "NEWEST" | "OLDEST" | "NAME_ASC" | "NAME_DESC" | "PRICE_ASC" | "PRICE_DESC";
}

export interface ProductOptionValueInput {
  /** Existing id or a stable draft id used by selectedOptionValueIds. */
  id?: string;
  value: string;
  sortOrder?: number;
}

export interface ProductOptionInput {
  /** Existing id or a stable draft id. */
  id?: string;
  name: string;
  sortOrder?: number;
  values: ProductOptionValueInput[];
}

export interface ProductVariantInput {
  /** Existing id or a stable draft id used by initialInventory. */
  id?: string;
  name: string;
  sku?: string | null;
  barcode?: string | null;
  price?: number | null;
  compareAtPrice?: number | null;
  cost?: number | null;
  selectedOptionValueIds?: string[];
  dimensions?: ProductDimensions;
  trackInventory?: boolean;
  allowBackorder?: boolean;
  isDefault?: boolean;
  enabled?: boolean;
  sortOrder?: number;
}

export interface ProductImageInput {
  id?: string;
  productVariantId?: string | null;
  mediaAssetId?: string;
  url: string;
  altText?: string | null;
  sortOrder?: number;
  isPrimary?: boolean;
  originalName?: string;
  mimeType?: string;
  sizeBytes?: number;
  width?: number | null;
  height?: number | null;
}

export interface ProductCoreInput {
  name: string;
  slug?: string;
  description?: string | null;
  status?: ProductStatus;
  sellingMode: SellingMode;
  seoTitle?: string | null;
  seoDescription?: string | null;
  categoryAssignments: ProductCategoryAssignment[];
  options?: ProductOptionInput[];
  images?: ProductImageInput[];
  variants: ProductVariantInput[];
}

export interface InitialInventoryInput {
  /** Resolve by a variant input id, or use variantIndex when the draft has no ids. */
  variantId?: string;
  variantIndex?: number;
  stockLocationId?: string;
  onHand: number;
  lowStockThreshold?: number | null;
}

export interface CreateProductInput extends ProductCoreInput {
  initialInventory?: InitialInventoryInput[];
}

export type UpdateProductInput = ProductCoreInput;

export interface ProductMutationResult {
  product: Product;
  initialMovement: StockMovement | null;
}

export interface PriceAdjustmentFilters {
  categoryId?: string;
  productIds?: string[];
}

export interface BulkPriceAdjustmentInput {
  filters?: PriceAdjustmentFilters;
  percentage: number;
  adjustPrice?: boolean;
  adjustCompareAtPrice?: boolean;
}

export interface PriceAdjustmentPreviewItem {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  previousPrice: number | null;
  nextPrice: number | null;
  previousCompareAtPrice: number | null;
  nextCompareAtPrice: number | null;
}

export interface BulkPriceAdjustmentResult {
  affectedProducts: number;
  affectedVariants: number;
  preview: PriceAdjustmentPreviewItem[];
}

export interface ProductService {
  list(filters?: ProductFilters): Promise<PaginatedResult<Product>>;
  get(productId: string): Promise<Product>;
  create(input: CreateProductInput): Promise<ProductMutationResult>;
  update(productId: string, input: UpdateProductInput): Promise<Product>;
  duplicate(productId: string): Promise<Product>;
  setStatus(productId: string, status: ProductStatus): Promise<Product>;
  archive(productId: string): Promise<Product>;
  delete(productId: string): Promise<void>;
  previewPriceAdjustment(input: BulkPriceAdjustmentInput): Promise<BulkPriceAdjustmentResult>;
  bulkPrice(input: BulkPriceAdjustmentInput): Promise<BulkPriceAdjustmentResult>;
  bulkPriceAdjustment(input: BulkPriceAdjustmentInput): Promise<BulkPriceAdjustmentResult>;
}
