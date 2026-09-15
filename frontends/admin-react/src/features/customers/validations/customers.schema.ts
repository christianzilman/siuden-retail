import { z } from "zod";

export const optionalEmail = z.union([z.literal(""), z.email("Ingresá un email válido.")]);

export const customerFormSchema = z
  .object({
    kind: z.enum(["INDIVIDUAL", "BUSINESS"]),
    firstName: z.string().trim().max(100, "Usá hasta 100 caracteres."),
    lastName: z.string().trim().max(100, "Usá hasta 100 caracteres."),
    businessName: z.string().trim().max(200, "Usá hasta 200 caracteres."),
    email: optionalEmail,
    phone: z
      .string()
      .trim()
      .max(40, "Usá hasta 40 caracteres.")
      .refine(
        (value) => value === "" || /^[+\d\s().-]+$/.test(value),
        "Ingresá un teléfono válido.",
      ),
    documentType: z.string(),
    documentNumber: z.string().trim().max(40, "Usá hasta 40 caracteres."),
    notes: z.string().trim().max(1000, "Usá hasta 1000 caracteres."),
  })
  .superRefine((values, context) => {
    if (values.kind === "INDIVIDUAL" && !values.firstName && !values.lastName) {
      context.addIssue({
        code: "custom",
        message: "Ingresá al menos el nombre o el apellido.",
        path: ["firstName"],
      });
    }
    if (values.kind === "BUSINESS" && !values.businessName) {
      context.addIssue({
        code: "custom",
        message: "Ingresá la razón social.",
        path: ["businessName"],
      });
    }
    if (Boolean(values.documentType) !== Boolean(values.documentNumber)) {
      context.addIssue({
        code: "custom",
        message: "Completá el tipo y el número de documento juntos.",
        path: values.documentType ? ["documentNumber"] : ["documentType"],
      });
    }
  });
