import type { InventoryItem, StockLocation, StockMovement, StockMovementType } from "@/features/inventory/types/inventory";
import type { PaginatedResult } from "@/types/common";
import type { PageInput } from "@/types/service";

export interface InventoryFilters extends PageInput {
  search?: string;
  categoryId?: string;
  stockLocationId?: string;
  status?: "ALL" | "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "NOT_TRACKED";
}

export interface StockMovementFilters extends PageInput {
  search?: string;
  stockLocationId?: string;
  type?: StockMovementType | "ALL";
  from?: string;
  to?: string;
}

export type ManualStockMovementType = "MANUAL_IN" | "MANUAL_OUT" | "ADJUSTMENT" | "CUSTOMER_RETURN";

export interface InventoryAdjustmentItemInput {
  productVariantId: string;
  quantityDelta: number;
  unitCost?: number | null;
  lowStockThreshold?: number | null;
}

export interface InventoryAdjustmentInput {
  stockLocationId?: string;
  type: ManualStockMovementType;
  reason?: string | null;
  items: InventoryAdjustmentItemInput[];
}

export interface InventoryAdjustmentResult {
  movement: StockMovement;
  inventory: InventoryItem[];
}

export interface InventoryService {
  listLocations(): Promise<StockLocation[]>;
  list(filters?: InventoryFilters): Promise<PaginatedResult<InventoryItem>>;
  listMovements(filters?: StockMovementFilters): Promise<PaginatedResult<StockMovement>>;
  adjust(input: InventoryAdjustmentInput): Promise<InventoryAdjustmentResult>;
}
