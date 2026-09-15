import type { StockMovementType } from "@/features/inventory/types/inventory";

export const movementLabels: Record<StockMovementType, string> = {
  INITIAL: "Stock inicial",
  MANUAL_IN: "Ingreso manual",
  MANUAL_OUT: "Salida manual",
  ADJUSTMENT: "Ajuste",
  SALE: "Venta",
  SALE_REVERSAL: "Anulación de venta",
  PURCHASE: "Compra",
  PURCHASE_RETURN: "Devolución de compra",
  CUSTOMER_RETURN: "Devolución de cliente",
};
