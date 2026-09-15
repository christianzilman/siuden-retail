import { EmptyState, PageHeader, QueryState, SearchInput, StatusBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { useMovementsQuery } from "@/features/inventory/hooks/use-inventory";
import type { StockMovementType } from "@/features/inventory/types/inventory";
import { movementLabels } from "@/features/inventory/utils/inventory-helpers";
import { formatDateTime, formatNumber } from "@/lib/format";
import { ArrowDown, ArrowUp, ClipboardList, Warehouse } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export function StockMovementsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const movements = useMovementsQuery({
    search: search || undefined,
    type: type as StockMovementType | "ALL",
    pageSize: 100,
  });
  const totals = useMemo(
    () => movements.data?.items.map((movement) => movement.items.reduce((sum, item) => sum + item.quantityDelta, 0)) ?? [],
    [movements.data],
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Movimientos de stock" description="Historial inmutable de ingresos, egresos, ventas y reversiones." actions={<Button variant="outline" asChild><Link to="/inventory"><Warehouse />Ver existencias</Link></Button>} />
      <Card><CardContent className="grid gap-3 pt-5 md:grid-cols-[1fr_260px]">
        <SearchInput value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar número, producto o SKU…" />
        <Select aria-label="Filtrar por tipo" value={type} onChange={(event) => setType(event.target.value)}>
          <option value="ALL">Todos los movimientos</option>
          {Object.entries(movementLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
      </CardContent></Card>
      <QueryState isLoading={movements.isPending} isError={movements.isError} error={movements.error} onRetry={() => movements.refetch()} isEmpty={movements.data?.items.length === 0} emptyFallback={<EmptyState icon={ClipboardList} title="Todavía no hay movimientos" description="Los stocks iniciales, ajustes y ventas aparecerán acá." />}>
        <div className="space-y-3">
          {movements.data?.items.map((movement, index) => {
            const total = totals[index] ?? 0;
            return (
              <Card key={movement.id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className={total >= 0 ? "grid size-9 place-items-center rounded-full bg-emerald-50 text-emerald-600" : "grid size-9 place-items-center rounded-full bg-red-50 text-red-600"}>
                        {total >= 0 ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
                      </span>
                      <div><CardTitle className="text-base">{movement.movementNumber} · {movementLabels[movement.type]}</CardTitle><p className="mt-1 text-xs text-muted-foreground">{formatDateTime(movement.occurredAt)} · {movement.createdBy?.displayName ?? "Sistema"}</p></div>
                    </div>
                    <div className="flex items-center gap-2"><StatusBadge status={movement.status} /><span className={total >= 0 ? "font-semibold tabular-nums text-emerald-600" : "font-semibold tabular-nums text-red-600"}>{total > 0 ? "+" : ""}{formatNumber(total)}</span></div>
                  </div>
                </CardHeader>
                <CardContent>
                  {movement.reason && <p className="mb-3 text-sm text-muted-foreground">Motivo: {movement.reason}</p>}
                  <div className="rounded-lg border">
                    {movement.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4 border-b px-3 py-2.5 text-sm last:border-0">
                        <span><span className="font-medium">{item.productName}</span><span className="ml-2 text-muted-foreground">{item.variantName}{item.sku ? ` · ${item.sku}` : ""}</span></span>
                        <span className={item.quantityDelta > 0 ? "font-semibold tabular-nums text-emerald-600" : "font-semibold tabular-nums text-red-600"}>{item.quantityDelta > 0 ? "+" : ""}{formatNumber(item.quantityDelta)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </QueryState>
    </div>
  );
}
