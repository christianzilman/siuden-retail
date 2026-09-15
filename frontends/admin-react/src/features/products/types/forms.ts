import type { priceAdjustmentSchema, productFormSchema } from "@/features/products/validations/products.schema";
import type { z } from "zod";

export type ProductFormValues = z.infer<typeof productFormSchema>;

export interface ImageDraft {
  id?: string;
  productVariantId: string | null;
  mediaAssetId?: string;
  url: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
  originalName?: string;
  mimeType?: string;
  sizeBytes?: number;
}

export type PriceAdjustmentValues = z.infer<typeof priceAdjustmentSchema>;
