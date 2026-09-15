import type { accountSchema } from "@/features/accounts/validations/accounts.schema";
import type { z } from "zod";

export type AccountFormValues = z.infer<typeof accountSchema>;
