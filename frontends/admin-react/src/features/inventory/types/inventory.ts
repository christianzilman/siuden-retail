import type { ISODateString } from "@/types/common";

export interface StockLocation {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  isDefault: boolean;
  enabled: boolean;
  addressLine?: string | null;
  addressNumber?: string | null;
  city?: string | null;
  province?: string | null;
}

export interface InventoryBalance {
  id: string;
  tenantId: string;
  stockLocationId: string;
  productVariantId: string;
  onHand: number;
  reserved: number;
  lowStockThreshold: number | null;
  updatedAt: ISODateString;
}

export type InventoryStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "NOT_TRACKED";

export interface InventoryItem {
  tenantId: string;
  stockLocationId: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  sku: string | null;
  imageUrl: string | null;
  categoryNames: string[];
  onHand: number;
  reserved: number;
  available: number;
  lowStockThreshold: number | null;
  trackInventory: boolean;
  status: InventoryStatus;
}

export type StockMovementType =
  | "INITIAL"
  | "MANUAL_IN"
  | "MANUAL_OUT"
  | "ADJUSTMENT"
  | "SALE"
  | "SALE_REVERSAL"
  | "PURCHASE"
  | "PURCHASE_RETURN"
  | "CUSTOMER_RETURN";

export type StockMovementStatus = "POSTED" | "REVERSED";

export interface StockMovementItemRecord {
  id: string;
  tenantId: string;
  stockMovementId: string;
  productVariantId: string;
  quantityDelta: number;
  unitCost: number | null;
  createdAt: ISODateString;
}

export interface StockMovementRecord {
  id: string;
  tenantId: string;
  movementNumber: string;
  stockLocationId: string;
  movementType: StockMovementType;
  status: StockMovementStatus;
  saleId: string | null;
  orderId: string | null;
  purchaseId: string | null;
  reversalOfId: string | null;
  reason: string | null;
  occurredAt: ISODateString;
  createdByUserId: string | null;
  createdAt: ISODateString;
  items: StockMovementItemRecord[];
}

export interface StockMovementItem {
  id: string;
  productVariantId: string;
  productName: string;
  variantName: string;
  sku: string | null;
  quantityDelta: number;
  unitCost: number | null;
}

export interface StockMovement {
  id: string;
  tenantId: string;
  movementNumber: string;
  stockLocationId: string;
  type: StockMovementType;
  status: StockMovementStatus;
  saleId: string | null;
  orderId: string | null;
  purchaseId: string | null;
  reversalOfId: string | null;
  reason: string | null;
  occurredAt: ISODateString;
  createdBy: {
    id: string;
    displayName: string;
  } | null;
  items: StockMovementItem[];
  createdAt: ISODateString;
}
