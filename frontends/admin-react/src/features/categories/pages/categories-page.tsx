import { EmptyState, PageHeader, QueryState } from "@/components/shared";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePermission } from "@/features/auth/hooks/use-auth";
import { CategoryEditor } from "@/features/categories/components/category-editor";
import { CategoryRow } from "@/features/categories/components/category-row";
import { useCategoriesQuery, useCategoryMutations } from "@/features/categories/hooks/use-categories";
import type { Category } from "@/features/categories/types/categories";
import type { EditorState } from "@/features/categories/types/forms";
import { Plus, Tags } from "lucide-react";
import { useState } from "react";

export function CategoriesPage() {
  const query = useCategoriesQuery();
  const mutations = useCategoryMutations();
  const canWrite = usePermission("categories.write");
  const [editor, setEditor] = useState<EditorState>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const categories = query.data ?? [];
  const roots = categories
    .filter((category) => category.parentId === null)
    .sort((left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name));

  return (
    <div className="page-shell">
      <PageHeader
        title="Categorías"
        description="Ordená el catálogo en niveles. Los productos siempre conservan una categoría principal."
        actions={canWrite && <Button onClick={() => setEditor({ category: null, parentId: null })}><Plus />Nueva categoría</Button>}
      />
      <QueryState
        isLoading={query.isPending}
        isError={query.isError}
        error={query.error}
        onRetry={() => query.refetch()}
        isEmpty={categories.length === 0}
        emptyFallback={<EmptyState icon={Tags} title="Todavía no hay categorías" description="Creá una categoría raíz para organizar los productos." action={<Button onClick={() => setEditor({ category: null, parentId: null })}><Plus />Crear categoría</Button>} />}
      >
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3 text-xs font-medium text-muted-foreground">
            <span>{categories.length} categorías en la jerarquía</span>
            <span>Las flechas reordenan dentro del mismo nivel</span>
          </div>
          <CardContent className="p-0">
            {roots.map((root) => (
              <CategoryRow
                key={root.id}
                category={root}
                depth={0}
                siblings={roots}
                categories={categories}
                canWrite={canWrite}
                onEdit={(category) => setEditor({ category, parentId: category.parentId })}
                onAddChild={(category) => setEditor({ category: null, parentId: category.id })}
                onDelete={setDeleteTarget}
              />
            ))}
          </CardContent>
        </Card>
      </QueryState>

      <CategoryEditor state={editor} categories={categories} onClose={() => setEditor(null)} />
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Sólo se puede eliminar una categoría sin productos ni subcategorías. La baja es lógica y no borra historial.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mutations.remove.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={mutations.remove.isPending}
              onClick={(event) => {
                event.preventDefault();
                if (!deleteTarget) return;
                void mutations.remove.mutateAsync(deleteTarget.id).then(() => setDeleteTarget(null));
              }}
            >
              {mutations.remove.isPending ? "Eliminando…" : "Eliminar categoría"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
