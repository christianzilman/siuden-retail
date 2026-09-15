import type { ISODateString } from "@/types/common";

export type ExternalCategoryProvider = "GOOGLE_SHOPPING" | "META" | "OTHER";

export interface CategoryExternalMapping {
  provider: ExternalCategoryProvider;
  externalCategoryId: string;
}

export interface Category {
  id: string;
  tenantId: string;
  parentId: string | null;
  name: string;
  slug: string;
  description?: string;
  isVisible: boolean;
  sortOrder: number;
  productCount: number;
  externalMappings?: CategoryExternalMapping[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt: ISODateString | null;
}
