import type { ISODateString } from "@/types/common";

export type SaleChannel = "POS" | "MANUAL" | "ONLINE";

export type SaleStatus = "DRAFT" | "CONFIRMED" | "CANCELLED" | "REFUNDED";

export type SalePaymentStatus = "UNPAID" | "PENDING" | "PARTIAL" | "PAID" | "REFUNDED";

export interface SaleItem {
  id: string;
  productVariantId: string | null;
  productNameSnapshot: string;
  variantNameSnapshot: string | null;
  skuSnapshot: string | null;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  lineTotal: number;
}

export interface Sale {
  id: string;
  tenantId: string;
  saleNumber: string;
  channel: SaleChannel;
  status: SaleStatus;
  paymentStatus: SalePaymentStatus;
  customerId: string | null;
  sourceOrderId: string | null;
  stockLocationId: string;
  customerNameSnapshot: string | null;
  customerDocumentSnapshot: string | null;
  items: SaleItem[];
  subtotal: number;
  discountTotal: number;
  total: number;
  currency: string;
  notes: string | null;
  soldAt: ISODateString | null;
  createdByUserId: string | null;
  createdByName: string | null;
  confirmedAt: ISODateString | null;
  cancelledAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
