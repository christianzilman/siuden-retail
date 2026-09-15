import { EmptyState, PageHeader, QueryState, SearchInput, StatusBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePermission } from "@/features/auth/hooks/use-auth";
import { useCategoriesQuery } from "@/features/categories/hooks/use-categories";
import { StockAdjustmentDialog } from "@/features/inventory/components/stock-adjustment-dialog";
import { useInventoryQuery } from "@/features/inventory/hooks/use-inventory";
import { formatNumber } from "@/lib/format";
import { ClipboardList, SlidersHorizontal, Warehouse } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export function InventoryPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [categoryId, setCategoryId] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const canAdjust = usePermission("inventory.adjust");
  const categories = useCategoriesQuery();
  const inventory = useInventoryQuery({
    search: search || undefined,
    status: status as "ALL" | "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "NOT_TRACKED",
    categoryId: categoryId || undefined,
    pageSize: 100,
  });
  const requestedVariantId = searchParams.get("variant");
  const selected =
    inventory.data?.items.find((item) => item.variantId === (selectedId ?? requestedVariantId)) ?? null;

  const closeAdjustment = () => {
    setSelectedId(null);
    if (requestedVariantId) {
      const next = new URLSearchParams(searchParams);
      next.delete("variant");
      setSearchParams(next, { replace: true });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Existencias"
        description="Consultá el saldo disponible por variante y registrá ajustes trazables."
        actions={<Button variant="outline" asChild><Link to="/inventory/movements"><ClipboardList />Ver movimientos</Link></Button>}
      />
      <Card>
        <CardContent className="grid gap-3 pt-5 md:grid-cols-[minmax(240px,1fr)_220px_220px]">
          <SearchInput value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar producto o SKU…" />
          <Select aria-label="Filtrar por categoría" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            <option value="">Todas las categorías</option>
            {categories.data?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </Select>
          <Select aria-label="Filtrar por estado de stock" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="ALL">Todos los estados</option>
            <option value="IN_STOCK">Con stock</option>
            <option value="LOW_STOCK">Stock bajo</option>
            <option value="OUT_OF_STOCK">Sin stock</option>
            <option value="NOT_TRACKED">Sin seguimiento</option>
          </Select>
        </CardContent>
      </Card>

      <QueryState
        isLoading={inventory.isPending}
        isError={inventory.isError}
        error={inventory.error}
        onRetry={() => inventory.refetch()}
        isEmpty={inventory.data?.items.length === 0}
        emptyFallback={<EmptyState icon={Warehouse} title="No encontramos existencias" description="Probá cambiando los filtros o creá un producto con seguimiento de stock." />}
      >
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead><TableHead>Categoría</TableHead><TableHead>SKU</TableHead>
                <TableHead className="text-right">Físico</TableHead><TableHead className="text-right">Reservado</TableHead>
                <TableHead className="text-right">Disponible</TableHead><TableHead>Estado</TableHead><TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.data?.items.map((item) => (
                <TableRow key={`${item.stockLocationId}-${item.variantId}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                        {item.imageUrl ? <img src={item.imageUrl} alt="" className="size-full object-cover" /> : <Warehouse className="m-3 size-4 text-muted-foreground" />}
                      </div>
                      <div><p className="font-medium">{item.productName}</p><p className="text-xs text-muted-foreground">{item.variantName}</p></div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-44 truncate">{item.categoryNames.join(" · ") || "Sin categoría"}</TableCell>
                  <TableCell className="font-mono text-xs">{item.sku ?? "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(item.onHand)}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{formatNumber(item.reserved)}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">{formatNumber(item.available)}</TableCell>
                  <TableCell><StatusBadge status={item.status} /></TableCell>
                  <TableCell className="text-right"><Button size="sm" variant="outline" disabled={!canAdjust || !item.trackInventory} onClick={() => setSelectedId(item.variantId)}><SlidersHorizontal />Ajustar</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </QueryState>
      <StockAdjustmentDialog item={selected} open={Boolean(selected)} onOpenChange={(open) => !open && closeAdjustment()} />
    </div>
  );
}
