import { normalizeText } from "@/features/products/utils/products-helpers";
import { z } from "zod";

export const nullableNonNegative = z.number().finite().min(0, "No puede ser negativo.").nullable();

export const optionValueSchema = z.object({ id: z.string().min(1), value: z.string().trim().min(1, "Ingresá un valor."), sortOrder: z.number().int().min(0) });

export const optionSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Ingresá el nombre de la opción."),
  sortOrder: z.number().int().min(0),
  values: z.array(optionValueSchema).min(1, "Agregá al menos un valor."),
});

export const variantSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Ingresá un nombre."),
  sku: z.string(),
  barcode: z.string(),
  price: nullableNonNegative,
  compareAtPrice: nullableNonNegative,
  cost: nullableNonNegative,
  selectedOptionValueIds: z.array(z.string()),
  trackInventory: z.boolean(),
  allowBackorder: z.boolean(),
  isDefault: z.boolean(),
  enabled: z.boolean(),
  sortOrder: z.number().int().min(0),
  initialStock: nullableNonNegative,
  lowStockThreshold: nullableNonNegative,
  weightKg: nullableNonNegative,
  heightCm: nullableNonNegative,
  widthCm: nullableNonNegative,
  depthCm: nullableNonNegative,
});

export const productFormSchema = z
  .object({
    name: z.string().trim().min(2, "Ingresá un nombre de al menos 2 caracteres."),
    slug: z.string().trim().min(1, "Ingresá un slug."),
    description: z.string(),
    seoTitle: z.string().max(255, "Usá hasta 255 caracteres."),
    seoDescription: z.string().max(500, "Usá hasta 500 caracteres."),
    sellingMode: z.enum(["DIRECT", "INQUIRY_ONLY"]),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
    simpleProduct: z.boolean(),
    categoryIds: z.array(z.string()).min(1, "Elegí al menos una categoría."),
    primaryCategoryId: z.string().min(1, "Elegí la categoría principal."),
    options: z.array(optionSchema),
    variants: z.array(variantSchema).min(1, "Agregá al menos una variante."),
  })
  .superRefine((values, context) => {
    if (!values.categoryIds.includes(values.primaryCategoryId)) {
      context.addIssue({ code: "custom", path: ["primaryCategoryId"], message: "La categoría principal debe estar seleccionada." });
    }
    const skus = new Set<string>();
    values.variants.forEach((variant, index) => {
      const sku = normalizeText(variant.sku);
      if (sku && skus.has(sku)) context.addIssue({ code: "custom", path: ["variants", index, "sku"], message: "El SKU está repetido en este producto." });
      if (sku) skus.add(sku);
      if (values.sellingMode === "DIRECT" && variant.enabled && variant.price === null) {
        context.addIssue({ code: "custom", path: ["variants", index, "price"], message: "Ingresá un precio para venta directa." });
      }
      if (variant.price !== null && variant.compareAtPrice !== null && variant.compareAtPrice < variant.price) {
        context.addIssue({ code: "custom", path: ["variants", index, "compareAtPrice"], message: "Debe ser mayor o igual al precio actual." });
      }
    });
    if (values.simpleProduct) {
      if (values.variants.length !== 1 || values.options.length !== 0) {
        context.addIssue({ code: "custom", path: ["simpleProduct"], message: "Un producto simple debe tener una única variante." });
      }
      return;
    }
    if (values.options.length === 0) {
      context.addIssue({ code: "custom", path: ["options"], message: "Agregá al menos una opción." });
      return;
    }
    const optionByValue = new Map(values.options.flatMap((option) => option.values.map((value) => [value.id, option.id] as const)));
    const combinations = new Set<string>();
    values.variants.forEach((variant, index) => {
      const optionIds = variant.selectedOptionValueIds.map((valueId) => optionByValue.get(valueId));
      if (optionIds.length !== values.options.length || optionIds.some((optionId) => !optionId) || new Set(optionIds).size !== values.options.length) {
        context.addIssue({ code: "custom", path: ["variants", index, "selectedOptionValueIds"], message: "Seleccioná un valor para cada opción." });
      }
      const key = [...variant.selectedOptionValueIds].sort().join("|");
      if (combinations.has(key)) context.addIssue({ code: "custom", path: ["variants", index, "selectedOptionValueIds"], message: "Esta combinación ya existe." });
      combinations.add(key);
    });
  });

export const priceAdjustmentSchema = z
  .object({
    categoryId: z.string(),
    percentage: z.number().finite().min(-100, "La reducción máxima es 100%.").max(1000, "Ingresá un porcentaje menor."),
    adjustPrice: z.boolean(),
    adjustCompareAtPrice: z.boolean(),
  })
  .refine((values) => values.adjustPrice || values.adjustCompareAtPrice, { message: "Seleccioná al menos un precio.", path: ["adjustPrice"] });
