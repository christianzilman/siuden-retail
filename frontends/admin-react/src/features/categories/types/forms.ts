import type { Category } from "@/features/categories/types/categories";
import type { categorySchema } from "@/features/categories/validations/categories.schema";
import type { z } from "zod";

export type CategoryValues = z.infer<typeof categorySchema>;

export type EditorState = { category: Category | null; parentId: string | null } | null;
