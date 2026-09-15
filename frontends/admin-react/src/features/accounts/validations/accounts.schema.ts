import { z } from "zod";

export const accountSchema = z
  .object({
    accountName: z.string().trim().min(2, "Ingresá el nombre de la cuenta.").max(150),
    tenantName: z.string().trim().min(2, "Ingresá el nombre de la tienda.").max(150),
    slug: z
      .string()
      .trim()
      .min(2, "Ingresá el slug.")
      .max(100)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usá minúsculas, números y guiones."),
    defaultCurrency: z.string().regex(/^[A-Z]{3}$/, "Ingresá una moneda ISO de tres letras."),
    timeZone: z.string().trim().min(1, "Ingresá la zona horaria.").max(80),
    createOwner: z.boolean(),
    ownerEmail: z.string(),
    ownerPassword: z.string(),
    ownerDisplayName: z.string(),
  })
  .superRefine((values, context) => {
    if (!values.createOwner) return;
    if (!z.email().safeParse(values.ownerEmail).success) {
      context.addIssue({ code: "custom", path: ["ownerEmail"], message: "Ingresá un email válido." });
    }
    if (values.ownerPassword.length < 12) {
      context.addIssue({ code: "custom", path: ["ownerPassword"], message: "Usá al menos 12 caracteres." });
    }
    if (values.ownerDisplayName.trim().length < 2) {
      context.addIssue({ code: "custom", path: ["ownerDisplayName"], message: "Ingresá el nombre del propietario." });
    }
  });
