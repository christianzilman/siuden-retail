import type { CreateCustomerInput } from "@/features/customers/types/contracts";
import type { Customer } from "@/features/customers/types/customers";
import type { customerFormSchema } from "@/features/customers/validations/customers.schema";
import type { z } from "zod";

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

export type CustomerFormProps = {
  customer?: Customer;
  pending: boolean;
  submitLabel: string;
  onSubmit: (input: CreateCustomerInput) => Promise<void>;
  onCancel: () => void;
  onDirtyChange?: (dirty: boolean) => void;
};
