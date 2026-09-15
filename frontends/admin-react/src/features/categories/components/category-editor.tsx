import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCategoryMutations } from "@/features/categories/hooks/use-categories";
import type { Category } from "@/features/categories/types/categories";
import type { CategoryValues, EditorState } from "@/features/categories/types/forms";
import { descendantIds, slugify } from "@/features/categories/utils/categories-helpers";
import { categorySchema } from "@/features/categories/validations/categories.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

export function CategoryEditor({
  state,
  categories,
  onClose,
}: {
  state: EditorState;
  categories: Category[];
  onClose: () => void;
}) {
  const mutations = useCategoryMutations();
  const form = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", slug: "", description: "", parentId: "", isVisible: true },
  });
  const category = state?.category ?? null;
  const isVisible = useWatch({ control: form.control, name: "isVisible" });
  const blockedParents = useMemo(
    () => category ? new Set([category.id, ...descendantIds(categories, category.id)]) : new Set<string>(),
    [categories, category],
  );

  useEffect(() => {
    if (!state) return;
    form.reset({
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      parentId: category?.parentId ?? state.parentId ?? "",
      isVisible: category?.isVisible ?? true,
    });
  }, [category, form, state]);

  const saving = mutations.create.isPending || mutations.update.isPending;
  const submit = form.handleSubmit(async (values) => {
    const input = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      parentId: values.parentId || null,
      isVisible: values.isVisible,
    };
    if (category) await mutations.update.mutateAsync({ id: category.id, input });
    else await mutations.create.mutateAsync(input);
    onClose();
  });

  return (
    <Dialog open={Boolean(state)} onOpenChange={(open) => !open && !saving && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Editar categoría" : state?.parentId ? "Nueva subcategoría" : "Nueva categoría"}</DialogTitle>
          <DialogDescription>Organizá el catálogo en una jerarquía clara para el equipo y la tienda.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="category-name">Nombre</Label>
            <Input
              id="category-name"
              autoFocus
              aria-invalid={Boolean(form.formState.errors.name)}
              {...form.register("name", {
                onChange: (event) => {
                  if (!category && !form.formState.dirtyFields.slug) {
                    form.setValue("slug", slugify((event.target as HTMLInputElement).value), { shouldValidate: true });
                  }
                },
              })}
            />
            {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category-slug">Slug</Label>
            <Input id="category-slug" aria-invalid={Boolean(form.formState.errors.slug)} {...form.register("slug")} />
            {form.formState.errors.slug && <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category-parent">Categoría superior</Label>
            <Select id="category-parent" {...form.register("parentId")}>
              <option value="">Sin categoría superior</option>
              {categories.map((candidate) => (
                <option key={candidate.id} value={candidate.id} disabled={blockedParents.has(candidate.id)}>
                  {candidate.name}{blockedParents.has(candidate.id) ? " · no disponible" : ""}
                </option>
              ))}
            </Select>
            <p className="text-xs text-muted-foreground">Una categoría nunca puede depender de sí misma ni de sus descendientes.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category-description">Descripción opcional</Label>
            <Textarea id="category-description" rows={3} {...form.register("description")} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div><p className="text-sm font-medium">Visible en el catálogo</p><p className="text-xs text-muted-foreground">Podés ocultarla sin eliminarla.</p></div>
            <Switch checked={isVisible} onCheckedChange={(checked) => form.setValue("isVisible", checked, { shouldDirty: true })} aria-label="Visible en el catálogo" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? "Guardando…" : category ? "Guardar cambios" : "Crear categoría"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
