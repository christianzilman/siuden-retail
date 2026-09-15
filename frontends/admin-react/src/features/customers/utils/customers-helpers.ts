import type { CreateCustomerInput } from "@/features/customers/types/contracts";
import type { Customer, CustomerKind, CustomerSource } from "@/features/customers/types/customers";
import type { CustomerFormValues } from "@/features/customers/types/forms";

export const sourceLabels: Record<CustomerSource, string> = {
  STOREFRONT: "Tienda online",
  POS: "Punto de venta",
  ADMIN: "Administrador",
  IMPORT: "Importación",
};

export const kindLabels: Record<CustomerKind, string> = {
  INDIVIDUAL: "Persona",
  BUSINESS: "Empresa",
};

export function customerName(customer: Customer): string {
  if (customer.kind === "BUSINESS" && customer.businessName) {
    return customer.businessName;
  }
  const name = [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim();
  return name || customer.businessName || "Cliente sin nombre";
}

export function customerInitials(customer: Customer): string {
  return customerName(customer)
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase("es-AR") ?? "")
    .join("");
}

export function nullable(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function formValues(customer?: Customer): CustomerFormValues {
  return {
    kind: customer?.kind ?? "INDIVIDUAL",
    firstName: customer?.firstName ?? "",
    lastName: customer?.lastName ?? "",
    businessName: customer?.businessName ?? "",
    email: customer?.email ?? "",
    phone: customer?.phone ?? "",
    documentType: customer?.documentType ?? "",
    documentNumber: customer?.documentNumber ?? "",
    notes: customer?.notes ?? "",
  };
}

export function customerInput(values: CustomerFormValues, customer?: Customer): CreateCustomerInput {
  return {
    source: customer?.source ?? "ADMIN",
    kind: values.kind,
    firstName: values.kind === "INDIVIDUAL" ? nullable(values.firstName) : null,
    lastName: values.kind === "INDIVIDUAL" ? nullable(values.lastName) : null,
    businessName: values.kind === "BUSINESS" ? nullable(values.businessName) : null,
    email: nullable(values.email),
    phone: nullable(values.phone),
    documentType: nullable(values.documentType),
    documentNumber: nullable(values.documentNumber),
    notes: nullable(values.notes),
  };
}
