import type { Sale, SaleChannel } from "@/features/sales/types/sales";

export const channelLabel: Record<SaleChannel, string> = {
  POS: "Punto de venta",
  MANUAL: "Manual",
  ONLINE: "Online",
};

export function customerName(sale: Sale) {
  return sale.customerNameSnapshot ?? "Consumidor final";
}
