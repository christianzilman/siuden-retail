import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Ingresá un nombre de al menos 2 caracteres."),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usá minúsculas, números y guiones."),
  description: z.string(),
  parentId: z.string(),
  isVisible: z.boolean(),
});
