import { EmptyState, PageHeader, QueryState, SearchInput, StatusBadge } from "@/components/shared";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePermission } from "@/features/auth/hooks/use-auth";
import { useCategoriesQuery } from "@/features/categories/hooks/use-categories";
import { useInventoryQuery } from "@/features/inventory/hooks/use-inventory";
import { useProductActionMutations, useProductsQuery } from "@/features/products/hooks/use-products";
import type { ProductFilters } from "@/features/products/types/contracts";
import type { Product, ProductStatus } from "@/features/products/types/products";
import { PAGE_SIZE, primaryCategory, productPrice, publicProductUrl } from "@/features/products/utils/products-helpers";
import { formatCurrency, formatNumber } from "@/lib/format";
import { Archive, ChevronLeft, ChevronRight, Copy, DollarSign, EllipsisVertical, Eye, EyeOff, Layers3, Package, PackagePlus, Pencil, Plus, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function ProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<ProductStatus | "ALL">("ALL");
  const [stock, setStock] = useState<NonNullable<ProductFilters["stock"]>>("ALL");
  const [sort, setSort] = useState<NonNullable<ProductFilters["sort"]>>("NEWEST");
  const [page, setPage] = useState(1);
  const [archiveTarget, setArchiveTarget] = useState<Product | null>(null);
  const categories = useCategoriesQuery();
  const inventory = useInventoryQuery({ pageSize: 100 });
  const canWrite = usePermission("products.write");
  const actions = useProductActionMutations();
  const products = useProductsQuery({
    search: search || undefined,
    categoryId: categoryId || undefined,
    status,
    stock,
    sort,
    page,
    pageSize: PAGE_SIZE,
  });

  const inventoryByProduct = useMemo(() => {
    const map = new Map<string, number>();
    inventory.data?.items.forEach((item) => {
      map.set(item.productId, (map.get(item.productId) ?? 0) + item.available);
    });
    return map;
  }, [inventory.data]);

  const copyLink = async (product: Product) => {
    try {
      await navigator.clipboard.writeText(publicProductUrl(product.slug));
      toast.success("Enlace público copiado");
    } catch {
      toast.error("No pudimos copiar el enlace. Intentá nuevamente.");
    }
  };

  return (
    <div className="page-shell">
      <PageHeader
        title="Productos"
        description="Administrá el catálogo, sus variantes, precios y publicación. El stock se consulta por separado."
        actions={
          canWrite ? (
            <>
              <Button variant="outline" asChild>
                <Link to="/products/price-adjustment">
                  <DollarSign /> Actualizar precios
                </Link>
              </Button>
              <Button asChild>
                <Link to="/products/new">
                  <PackagePlus /> Nuevo producto
                </Link>
              </Button>
            </>
          ) : null
        }
      />

      <Card>
        <CardContent className="grid gap-3 pt-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-[minmax(240px,1fr)_170px_150px_150px_170px]">
          <SearchInput
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1); }}
            onClear={() => { setSearch(""); setPage(1); }}
            placeholder="Buscar por nombre o SKU…"
          />
          <Select value={categoryId} onChange={(event) => { setCategoryId(event.target.value); setPage(1); }} aria-label="Categoría">
            <option value="">Todas las categorías</option>
            {categories.data?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Select value={status} onChange={(event) => { setStatus(event.target.value as ProductStatus | "ALL"); setPage(1); }} aria-label="Publicación">
            <option value="ALL">Todos los estados</option>
            <option value="PUBLISHED">Publicados</option>
            <option value="DRAFT">Borradores</option>
            <option value="ARCHIVED">Archivados</option>
          </Select>
          <Select value={stock} onChange={(event) => { setStock(event.target.value as NonNullable<ProductFilters["stock"]>); setPage(1); }} aria-label="Stock">
            <option value="ALL">Cualquier stock</option>
            <option value="IN_STOCK">Con stock</option>
            <option value="LOW_STOCK">Stock bajo</option>
            <option value="OUT_OF_STOCK">Sin stock</option>
            <option value="NOT_TRACKED">Sin seguimiento</option>
          </Select>
          <Select value={sort} onChange={(event) => { setSort(event.target.value as NonNullable<ProductFilters["sort"]>); setPage(1); }} aria-label="Orden">
            <option value="NEWEST">Más recientes</option>
            <option value="OLDEST">Más antiguos</option>
            <option value="NAME_ASC">Nombre A–Z</option>
            <option value="NAME_DESC">Nombre Z–A</option>
            <option value="PRICE_ASC">Menor precio</option>
            <option value="PRICE_DESC">Mayor precio</option>
          </Select>
        </CardContent>
      </Card>

      <QueryState
        isLoading={products.isPending || categories.isPending || inventory.isPending}
        isError={products.isError || categories.isError || inventory.isError}
        error={products.error ?? categories.error ?? inventory.error}
        onRetry={() => void Promise.all([products.refetch(), categories.refetch(), inventory.refetch()])}
        isEmpty={products.data?.items.length === 0}
        emptyFallback={
          <EmptyState
            icon={Package}
            title="No encontramos productos"
            description="Probá cambiando los filtros o creá el primer producto del catálogo."
            action={canWrite ? <Button asChild><Link to="/products/new"><Plus />Crear producto</Link></Button> : null}
          />
        }
      >
        <Card className="overflow-hidden">
          <Table className="min-w-[1050px]" scrollLabel="Listado de productos">
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría principal</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead className="text-center">Variantes</TableHead>
                <TableHead className="text-right">Disponible</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.data?.items.map((product) => {
                const image = product.images.find((candidate) => candidate.isPrimary) ?? product.images[0];
                const defaultVariant = product.variants.find((variant) => variant.isDefault) ?? product.variants[0];
                const price = productPrice(product);
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg border bg-muted">
                          {image ? <img src={image.url} alt="" className="size-full object-cover" /> : <Package className="size-5 text-muted-foreground" />}
                        </div>
                        <div className="min-w-0">
                          <Link to={`/products/${product.id}/edit`} className="block max-w-64 truncate font-semibold hover:text-primary hover:underline">
                            {product.name}
                          </Link>
                          <p className="mt-0.5 max-w-64 truncate text-xs text-muted-foreground">/{product.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{primaryCategory(product, categories.data ?? [])}</TableCell>
                    <TableCell className="font-mono text-xs">{defaultVariant?.sku ?? "—"}</TableCell>
                    <TableCell>
                      <p className="font-semibold tabular-nums">{formatCurrency(price.current)}</p>
                      {price.compare !== null ? <p className="text-xs text-muted-foreground line-through">{formatCurrency(price.compare)}</p> : null}
                    </TableCell>
                    <TableCell className="text-center tabular-nums">{product.variants.length}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">{formatNumber(inventoryByProduct.get(product.id) ?? 0)}</TableCell>
                    <TableCell><StatusBadge status={product.status} /></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" aria-label={`Acciones de ${product.name}`}>
                            <EllipsisVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild><Link to={`/products/${product.id}/edit`}><Pencil />Editar</Link></DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={!canWrite || actions.setStatus.isPending}
                            onSelect={() => actions.setStatus.mutate({ productId: product.id, status: product.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" })}
                          >
                            {product.status === "PUBLISHED" ? <EyeOff /> : <Eye />}
                            {product.status === "PUBLISHED" ? "Despublicar" : "Publicar"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => void copyLink(product)}><Copy />Copiar enlace</DropdownMenuItem>
                          <DropdownMenuItem disabled={!canWrite || actions.duplicate.isPending} onSelect={() => actions.duplicate.mutate(product.id)}><Layers3 />Duplicar</DropdownMenuItem>
                          <DropdownMenuItem asChild><Link to={`/inventory?product=${product.id}`}><SlidersHorizontal />Ajustar stock</Link></DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem destructive disabled={!canWrite} onSelect={() => setArchiveTarget(product)}><Archive />Archivar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {products.data ? (
            <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted-foreground">
                {products.data.total} {products.data.total === 1 ? "producto" : "productos"}
              </p>
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="text-xs text-muted-foreground">Página {products.data.page} de {products.data.totalPages}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon-sm" aria-label="Página anterior" disabled={products.data.page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft /></Button>
                  <Button variant="outline" size="icon-sm" aria-label="Página siguiente" disabled={products.data.page >= products.data.totalPages} onClick={() => setPage((current) => current + 1)}><ChevronRight /></Button>
                </div>
              </div>
            </div>
          ) : null}
        </Card>
      </QueryState>

      <AlertDialog open={Boolean(archiveTarget)} onOpenChange={(open) => !open && setArchiveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Archivar {archiveTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Dejará de aparecer en el catálogo y no podrá venderse. El historial de stock y ventas se conserva.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actions.archive.isPending}>Volver</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={actions.archive.isPending}
              onClick={() => {
                if (!archiveTarget) return;
                actions.archive.mutate(archiveTarget.id, { onSuccess: () => setArchiveTarget(null) });
              }}
            >
              {actions.archive.isPending ? "Archivando…" : "Archivar producto"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
