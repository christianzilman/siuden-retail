import type { Category } from "@/features/categories/types/categories";

export interface CategoryFilters {
  includeHidden?: boolean;
}

export interface CreateCategoryInput {
  parentId?: string | null;
  name: string;
  slug?: string;
  description?: string;
  sortOrder?: number;
  isVisible?: boolean;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export interface CategoryOrderInput {
  id: string;
  parentId: string | null;
  sortOrder: number;
}

export interface CategoryService {
  list(filters?: CategoryFilters): Promise<Category[]>;
  create(input: CreateCategoryInput): Promise<Category>;
  update(categoryId: string, input: UpdateCategoryInput): Promise<Category>;
  remove(categoryId: string): Promise<void>;
  delete(categoryId: string): Promise<void>;
  reorder(input: CategoryOrderInput[]): Promise<Category[]>;
}
