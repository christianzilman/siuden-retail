import type { AdjustmentValues } from "@/features/inventory/types/forms";
import type { StockMovementType } from "@/features/inventory/types/inventory";

export const movementLabels: Record<StockMovementType, string> = {
  INITIAL: "Stock inicial",
  MANUAL_IN: "Ingreso manual",
  MANUAL_OUT: "Salida manual",
  ADJUSTMENT: "Ajuste",
  SALE: "Venta",
  SALE_REVERSAL: "Cancelación de venta",
  PURCHASE: "Compra",
  PURCHASE_RETURN: "Devolución de compra",
  CUSTOMER_RETURN: "Devolución de cliente",
};

export function quantityDelta(type: AdjustmentValues["type"], amount: number): number {
  if (type === "MANUAL_OUT") return -Math.abs(amount);
  if (type === "MANUAL_IN" || type === "CUSTOMER_RETURN") return Math.abs(amount);
  return amount;
}
