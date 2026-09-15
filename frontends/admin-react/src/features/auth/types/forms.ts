import type { loginSchema } from "@/features/auth/validations/auth.schema";
import type { z } from "zod";

export type LoginValues = z.infer<typeof loginSchema>;
