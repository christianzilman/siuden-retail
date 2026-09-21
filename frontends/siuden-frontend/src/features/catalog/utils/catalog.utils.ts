import type { Category } from "../types/catalog.types";
import { GOLD_IMAGE, SILVER_IMAGE } from "../data/storefront-content";

export interface CategoryLevel extends Category {
  depth: number;
}

export function normalizeCategoryTree(categories: Category[]) {
  const seen = new Set<string>();

  const visit = (items: Category[]): Category[] =>
    items
      .filter((category) => {
        if (seen.has(category.id)) return false;
        seen.add(category.id);
        return true;
      })
      .map((category) => ({
        ...category,
        children: visit(category.children ?? []),
      }))
      .sort(
        (a, b) =>
          a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "es"),
      );

  return visit(categories);
}

export function flattenCategories(
  categories: Category[],
  depth = 0,
): CategoryLevel[] {
  return categories
    .filter((category) => category.isVisible)
    .sort(
      (a, b) =>
        a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "es"),
    )
    .flatMap((category) => [
      { ...category, depth },
      ...flattenCategories(category.children, depth + 1),
    ]);
}

export function findCategoryBySlug(categories: Category[], slug?: string) {
  if (!slug) return undefined;
  return flattenCategories(categories).find((category) => category.slug === slug);
}

export function findCategoryPath(categories: Category[], slug?: string) {
  if (!slug) return [];

  const visit = (items: Category[], parents: Category[]): Category[] => {
    for (const category of items) {
      const path = [...parents, category];
      if (category.slug === slug) return path;

      const childPath = visit(category.children ?? [], path);
      if (childPath.length > 0) return childPath;
    }

    return [];
  };

  return visit(categories, []);
}

export function pickStorefrontCategory(
  categories: Category[],
  tenantSlug: string,
) {
  const candidates = flattenCategories(categories).filter(
    (category) => category.slug !== "general",
  );

  if (candidates.length === 0) return undefined;

  const dailyKey = `${tenantSlug}-${new Date().toISOString().slice(0, 10)}`;
  const seed = Array.from(dailyKey).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
  return candidates[seed % candidates.length];
}

export function categoryProductsHref(tenantSlug: string, category: Category) {
  return `/${tenantSlug}/productos?categoria=${encodeURIComponent(category.slug)}`;
}

export function getProductImageUrl(imageUrl: string | null, index = 0) {
  const fallbacks = [GOLD_IMAGE, SILVER_IMAGE];

  if (!imageUrl) return fallbacks[index % fallbacks.length];
  if (/^(https?:|data:|blob:)/i.test(imageUrl)) return imageUrl;

  const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
  if (apiBaseUrl && apiBaseUrl !== "/") {
    return `${apiBaseUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  }

  return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
}
