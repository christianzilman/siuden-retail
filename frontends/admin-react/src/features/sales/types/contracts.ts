import type { StockMovement } from "@/features/inventory/types/inventory";
import type { Sale, SaleChannel } from "@/features/sales/types/sales";
import type { PaginatedResult } from "@/types/common";
import type { PageInput } from "@/types/service";

export interface SaleFilters extends PageInput {
  search?: string;
  status?: Sale["status"] | "ALL";
  channel?: SaleChannel | "ALL";
  customerId?: string;
  from?: string;
  to?: string;
}

export interface ConfirmSaleItemInput {
  productVariantId: string;
  quantity: number;
  unitPrice?: number;
  discountAmount?: number;
}

export interface ConfirmSaleInput {
  channel: Extract<SaleChannel, "POS" | "MANUAL">;
  customerId?: string | null;
  stockLocationId?: string;
  notes?: string | null;
  items: ConfirmSaleItemInput[];
}

export interface ConfirmSaleResult {
  sale: Sale;
  movement: StockMovement;
}

export interface CancelSaleInput {
  reason?: string | null;
}

export interface CancelSaleResult {
  sale: Sale;
  reversalMovement: StockMovement;
}

export interface SaleService {
  list(filters?: SaleFilters): Promise<PaginatedResult<Sale>>;
  get(saleId: string): Promise<Sale>;
  confirm(input: ConfirmSaleInput): Promise<ConfirmSaleResult>;
  cancel(saleId: string, input?: CancelSaleInput): Promise<CancelSaleResult>;
}
