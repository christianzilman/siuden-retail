import type { adjustmentSchema } from "@/features/inventory/validations/inventory.schema";
import type { z } from "zod";

export type AdjustmentValues = z.input<typeof adjustmentSchema>;
