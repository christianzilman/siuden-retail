import { z } from "zod";

export const adjustmentSchema = z.object({
  type: z.enum(["MANUAL_IN", "MANUAL_OUT", "ADJUSTMENT", "CUSTOMER_RETURN"]),
  amount: z.coerce.number().refine((value) => value !== 0, "Ingresá una cantidad distinta de cero."),
  reason: z.string().trim().min(3, "Explicá brevemente el motivo."),
  lowStockThreshold: z.union([z.coerce.number().min(0), z.literal("")]).optional(),
});
