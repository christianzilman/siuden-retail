import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCategoryMutations } from "@/features/categories/hooks/use-categories";
import type { Category } from "@/features/categories/types/categories";
import { formatNumber } from "@/lib/format";
import { ArrowDown, ArrowUp, ChevronRight, FolderOpen, FolderPlus, Pencil, Tags, Trash2 } from "lucide-react";

export function CategoryRow({
  category,
  depth,
  siblings,
  categories,
  canWrite,
  onEdit,
  onAddChild,
  onDelete,
}: {
  category: Category;
  depth: number;
  siblings: Category[];
  categories: Category[];
  canWrite: boolean;
  onEdit: (category: Category) => void;
  onAddChild: (category: Category) => void;
  onDelete: (category: Category) => void;
}) {
  const mutations = useCategoryMutations();
  const children = categories
    .filter((item) => item.parentId === category.id)
    .sort((left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name));
  const sortedSiblings = [...siblings].sort((left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name));
  const index = sortedSiblings.findIndex((item) => item.id === category.id);
  const move = async (direction: -1 | 1) => {
    const other = sortedSiblings[index + direction];
    if (!other) return;
    await mutations.reorder.mutateAsync([
      { id: category.id, parentId: category.parentId, sortOrder: other.sortOrder },
      { id: other.id, parentId: other.parentId, sortOrder: category.sortOrder },
    ]);
  };

  return (
    <>
      <div className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b px-3 py-3 last:border-b-0 sm:px-4" style={{ paddingLeft: `${12 + depth * 24}px` }}>
        <div className="flex min-w-0 items-center gap-3">
          {depth > 0 && <ChevronRight className="size-3.5 shrink-0 text-slate-300" />}
          <span className={category.isVisible ? "grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary" : "grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground"}>
            {children.length ? <FolderOpen className="size-4" /> : <Tags className="size-4" />}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2"><p className="truncate text-sm font-semibold">{category.name}</p>{!category.isVisible && <Badge variant="neutral">Oculta</Badge>}</div>
            <p className="truncate text-xs text-muted-foreground">/{category.slug} · {formatNumber(category.productCount)} productos</p>
          </div>
        </div>
        {canWrite && (
          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="icon-sm" onClick={() => void move(-1)} disabled={index <= 0 || mutations.reorder.isPending} aria-label={`Subir ${category.name}`}><ArrowUp /></Button>
            <Button variant="ghost" size="icon-sm" onClick={() => void move(1)} disabled={index >= sortedSiblings.length - 1 || mutations.reorder.isPending} aria-label={`Bajar ${category.name}`}><ArrowDown /></Button>
            <Switch checked={category.isVisible} onCheckedChange={(checked) => mutations.update.mutate({ id: category.id, input: { isVisible: checked } })} aria-label={`${category.isVisible ? "Ocultar" : "Mostrar"} ${category.name}`} className="mx-1 scale-90" />
            <Button variant="ghost" size="icon-sm" onClick={() => onAddChild(category)} aria-label={`Agregar subcategoría a ${category.name}`}><FolderPlus /></Button>
            <Button variant="ghost" size="icon-sm" onClick={() => onEdit(category)} aria-label={`Editar ${category.name}`}><Pencil /></Button>
            <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={() => onDelete(category)} aria-label={`Eliminar ${category.name}`}><Trash2 /></Button>
          </div>
        )}
      </div>
      {children.map((child) => (
        <CategoryRow
          key={child.id}
          category={child}
          depth={depth + 1}
          siblings={children}
          categories={categories}
          canWrite={canWrite}
          onEdit={onEdit}
          onAddChild={onAddChild}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}
