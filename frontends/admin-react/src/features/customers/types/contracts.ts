import type { Customer, CustomerAddress, CustomerKind, CustomerSource, CustomerStatus } from "@/features/customers/types/customers";
import type { PaginatedResult } from "@/types/common";
import type { PageInput } from "@/types/service";

export interface CustomerFilters extends PageInput {
  search?: string;
  status?: CustomerStatus | "ALL";
  kind?: CustomerKind | "ALL";
  source?: CustomerSource | "ALL";
}

export type CustomerAddressInput = Omit<CustomerAddress, "id"> & { id?: string };

export interface CustomerInput {
  userId?: string | null;
  customerGroupId?: string | null;
  source?: CustomerSource;
  kind?: CustomerKind;
  firstName?: string | null;
  lastName?: string | null;
  businessName?: string | null;
  email?: string | null;
  phone?: string | null;
  documentType?: string | null;
  documentNumber?: string | null;
  taxCondition?: string | null;
  notes?: string | null;
  addresses?: CustomerAddressInput[];
}

export type CreateCustomerInput = CustomerInput;

export type UpdateCustomerInput = CustomerInput;

export interface CustomerService {
  list(filters?: CustomerFilters): Promise<PaginatedResult<Customer>>;
  get(customerId: string): Promise<Customer>;
  create(input: CreateCustomerInput): Promise<Customer>;
  update(customerId: string, input: UpdateCustomerInput): Promise<Customer>;
  setStatus(customerId: string, status: CustomerStatus): Promise<Customer>;
}
