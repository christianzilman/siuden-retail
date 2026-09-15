import type { ISODateString } from "@/types/common";

export type CustomerSource = "STOREFRONT" | "POS" | "ADMIN" | "IMPORT";

export type CustomerKind = "INDIVIDUAL" | "BUSINESS";

export type CustomerStatus = "ACTIVE" | "BLOCKED" | "ARCHIVED";

export type CustomerAddressType = "HOME" | "BILLING" | "SHIPPING" | "OTHER";

export interface CustomerAddress {
  id: string;
  addressType: CustomerAddressType;
  label: string | null;
  street: string;
  number: string | null;
  floor: string | null;
  apartment: string | null;
  city: string;
  province: string;
  postalCode: string | null;
  countryCode: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  tenantId: string;
  userId: string | null;
  customerGroupId: string | null;
  source: CustomerSource;
  kind: CustomerKind;
  firstName: string | null;
  lastName: string | null;
  businessName: string | null;
  email: string | null;
  phone: string | null;
  documentType: string | null;
  documentNumber: string | null;
  taxCondition: string | null;
  notes: string | null;
  addresses: CustomerAddress[];
  status: CustomerStatus;
  blockedAt: ISODateString | null;
  salesCount: number;
  totalSpent: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt: ISODateString | null;
}
