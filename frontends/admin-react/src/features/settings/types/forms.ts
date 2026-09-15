import type { contactSettingsSchema, storeSettingsSchema } from "@/features/settings/validations/settings.schema";
import type { z } from "zod";

export type StoreSettingsValues = z.infer<typeof storeSettingsSchema>;

export type ContactSettingsValues = z.infer<typeof contactSettingsSchema>;

export type ColorFieldName = "primaryColor" | "secondaryColor" | "backgroundColor" | "textColor";
