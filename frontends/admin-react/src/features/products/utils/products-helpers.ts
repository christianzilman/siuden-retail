import type { Category } from "@/features/categories/types/categories";
import type { ProductFormValues } from "@/features/products/types/forms";
import type { Product, ProductDimensions } from "@/features/products/types/products";

export const PAGE_SIZE = 10;

export const MAX_IMAGES = 20;

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function draftId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `draft-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("es-AR");
}

export function slugify(value: string): string {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function nullable(value: string): string | null {
  const normalized = value.trim();
  return normalized ? normalized : null;
}

export function numberOrNull(value: unknown): number | null {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function productPrice(product: Product): { current: number | null; compare: number | null } {
  const variant =
    product.variants.find((candidate) => candidate.isDefault && candidate.enabled) ??
    product.variants.find((candidate) => candidate.enabled) ??
    product.variants[0];
  return { current: variant?.price ?? null, compare: variant?.compareAtPrice ?? null };
}

export function primaryCategory(product: Product, categories: Category[]): string {
  const primaryId = product.categoryAssignments.find((assignment) => assignment.isPrimary)?.categoryId;
  return categories.find((category) => category.id === primaryId)?.name ?? "Sin categoría";
}

export function publicProductUrl(slug: string): string {
  return new URL(`/productos/${slug}`, "https://rubi.siuden.com").toString();
}

export function defaultVariant(): ProductFormValues["variants"][number] {
  return {
    id: draftId(),
    name: "Default",
    sku: "",
    barcode: "",
    price: null,
    compareAtPrice: null,
    cost: null,
    selectedOptionValueIds: [],
    trackInventory: true,
    allowBackorder: false,
    isDefault: true,
    enabled: true,
    sortOrder: 0,
    initialStock: 0,
    lowStockThreshold: null,
    weightKg: null,
    heightCm: null,
    widthCm: null,
    depthCm: null,
  };
}

export const PRODUCT_DEFAULTS: ProductFormValues = {
  name: "",
  slug: "",
  description: "",
  seoTitle: "",
  seoDescription: "",
  sellingMode: "DIRECT",
  status: "DRAFT",
  simpleProduct: true,
  categoryIds: [],
  primaryCategoryId: "",
  options: [],
  variants: [defaultVariant()],
};

export function dimensionsFromForm(variant: ProductFormValues["variants"][number]): ProductDimensions {
  return {
    ...(variant.weightKg !== null ? { weightKg: variant.weightKg } : {}),
    ...(variant.heightCm !== null ? { heightCm: variant.heightCm } : {}),
    ...(variant.widthCm !== null ? { widthCm: variant.widthCm } : {}),
    ...(variant.depthCm !== null ? { depthCm: variant.depthCm } : {}),
  };
}
