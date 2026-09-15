import { argentinaLocalDigits, normalizeSocialHandle } from "@/features/settings/utils/settings-helpers";
import { z } from "zod";

export const optionalEmail = z
  .string()
  .trim()
  .refine((value) => value === "" || z.email().safeParse(value).success, {
    message: "Ingresá un email válido.",
  });

export const optionalHttpUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || /^https?:\/\/\S+$/i.test(value), {
    message: "Ingresá una URL completa que comience con http:// o https://.",
  });

export const hexColor = z
  .string()
  .trim()
  .regex(/^#[0-9a-f]{6}$/i, "Usá un color hexadecimal de seis dígitos.");

export const storeSettingsSchema = z
  .object({
    brandName: z.string().trim().min(2, "Ingresá el nombre comercial."),
    contactEmail: optionalEmail,
    phone: z.string().trim().max(40, "El teléfono es demasiado largo."),
    addressLine: z.string().trim().max(120, "La dirección es demasiado larga."),
    addressNumber: z.string().trim().max(20, "El número es demasiado largo."),
    city: z.string().trim().max(80, "La ciudad es demasiado larga."),
    province: z.string().trim().max(80, "La provincia es demasiado larga."),
    postalCode: z.string().trim().max(16, "El código postal es demasiado largo."),
    primaryColor: hexColor,
    secondaryColor: hexColor,
    backgroundColor: hexColor,
    textColor: hexColor,
    headingFont: z.string().min(1),
    bodyFont: z.string().min(1),
    borderRadius: z.string().min(1),
    announcementEnabled: z.boolean(),
    announcementText: z.string().trim().max(120, "El mensaje admite hasta 120 caracteres."),
    announcementUrl: optionalHttpUrl,
    isPublished: z.boolean(),
    showPrices: z.boolean(),
    defaultCatalogSort: z.enum([
      "FEATURED",
      "NEWEST",
      "PRICE_ASC",
      "PRICE_DESC",
      "NAME_ASC",
    ]),
    catalogColumnsDesktop: z.number().int().min(2).max(4),
  })
  .superRefine((values, context) => {
    if (values.announcementEnabled && !values.announcementText) {
      context.addIssue({
        code: "custom",
        path: ["announcementText"],
        message: "Escribí el mensaje que se mostrará en la tienda.",
      });
    }
  });

export const contactSettingsSchema = z
  .object({
    whatsapp: z.string().trim(),
    whatsappEnabled: z.boolean(),
    instagram: z.string().trim(),
    instagramEnabled: z.boolean(),
    facebook: z.string().trim(),
    facebookEnabled: z.boolean(),
    contactFormEnabled: z.boolean(),
  })
  .superRefine((values, context) => {
    const whatsappDigits = argentinaLocalDigits(values.whatsapp);
    if (values.whatsapp && whatsappDigits.length !== 10) {
      context.addIssue({
        code: "custom",
        path: ["whatsapp"],
        message: "Ingresá un celular argentino con código de área y diez dígitos.",
      });
    }
    if (values.whatsappEnabled && !values.whatsapp) {
      context.addIssue({
        code: "custom",
        path: ["whatsapp"],
        message: "Ingresá un número antes de activar WhatsApp.",
      });
    }

    (["instagram", "facebook"] as const).forEach((network) => {
      const value = values[network];
      const enabled = values[`${network}Enabled`];
      const handle = normalizeSocialHandle(value, network);
      if (value && !/^[a-z0-9._-]{2,80}$/i.test(handle)) {
        context.addIssue({
          code: "custom",
          path: [network],
          message: "Ingresá un usuario o una URL válida.",
        });
      }
      if (enabled && !value) {
        context.addIssue({
          code: "custom",
          path: [network],
          message: `Ingresá un usuario antes de activar ${network === "instagram" ? "Instagram" : "Facebook"}.`,
        });
      }
    });
  });
