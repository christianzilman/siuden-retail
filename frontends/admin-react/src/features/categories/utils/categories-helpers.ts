import type { Category } from "@/features/categories/types/categories";

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-AR")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function descendantIds(categories: Category[], categoryId: string): Set<string> {
  const result = new Set<string>();
  const visit = (id: string) => {
    categories.filter((category) => category.parentId === id).forEach((child) => {
      result.add(child.id);
      visit(child.id);
    });
  };
  visit(categoryId);
  return result;
}
