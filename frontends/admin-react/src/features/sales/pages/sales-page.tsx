import { EmptyState, PageHeader, QueryState, SearchInput, StatusBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePermission } from "@/features/auth/hooks/use-auth";
import { useSaleMutations, useSalesQuery } from "@/features/sales/hooks/use-sales";
import type { Sale, SaleChannel, SaleStatus } from "@/features/sales/types/sales";
import { channelLabel, customerName } from "@/features/sales/utils/sales-helpers";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/format";
import { Ban, Eye, Plus, ReceiptText } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function SalesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SaleStatus | "ALL">("ALL");
  const [channel, setChannel] = useState<SaleChannel | "ALL">("ALL");
  const canCreate = usePermission("sales.create");
  const canCancel = usePermission("sales.cancel");
  const sales = useSalesQuery({ search: search || undefined, status, channel, pageSize: 100 });
  const actions = useSaleMutations();

  const cancel = async (sale: Sale) => {
    if (!window.confirm(`¿Cancelar la venta ${sale.saleNumber}? El stock se reintegrará con un movimiento compensatorio.`)) return;
    await actions.cancel.mutateAsync({ saleId: sale.id, reason: "Cancelación solicitada desde el administrador" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ventas"
        description="Consultá comprobantes, canales y estados sin mezclar el registro de cobro."
        actions={canCreate && <Button asChild><Link to="/sales/new"><Plus />Nueva venta</Link></Button>}
      />
      <Card><CardContent className="grid gap-3 pt-5 md:grid-cols-[1fr_210px_210px]">
        <SearchInput value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar número o cliente…" />
        <Select aria-label="Filtrar estado" value={status} onChange={(event) => setStatus(event.target.value as SaleStatus | "ALL")}>
          <option value="ALL">Todos los estados</option><option value="CONFIRMED">Confirmadas</option><option value="CANCELLED">Canceladas</option><option value="DRAFT">Borradores</option>
        </Select>
        <Select aria-label="Filtrar canal" value={channel} onChange={(event) => setChannel(event.target.value as SaleChannel | "ALL")}>
          <option value="ALL">Todos los canales</option><option value="POS">Punto de venta</option><option value="MANUAL">Manual</option><option value="ONLINE">Online</option>
        </Select>
      </CardContent></Card>
      <QueryState isLoading={sales.isPending} isError={sales.isError} error={sales.error} onRetry={() => sales.refetch()} isEmpty={sales.data?.items.length === 0} emptyFallback={<EmptyState icon={ReceiptText} title="Todavía no hay ventas" description="Creá una venta manual o abrí el punto de venta." action={<Button asChild><Link to="/sales/new">Crear primera venta</Link></Button>} />}>
        <Card className="overflow-hidden">
          <Table>
            <TableHeader><TableRow><TableHead>Número</TableHead><TableHead>Fecha</TableHead><TableHead>Cliente</TableHead><TableHead>Canal</TableHead><TableHead>Unidades</TableHead><TableHead>Total</TableHead><TableHead>Estado</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
            <TableBody>
              {sales.data?.items.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-semibold"><Link className="hover:text-primary hover:underline" to={`/sales/${sale.id}`}>{sale.saleNumber}</Link></TableCell>
                  <TableCell>{formatDateTime(sale.soldAt ?? sale.createdAt)}</TableCell>
                  <TableCell>{customerName(sale)}</TableCell>
                  <TableCell>{channelLabel[sale.channel]}</TableCell>
                  <TableCell>{formatNumber(sale.items.reduce((sum, item) => sum + item.quantity, 0))}</TableCell>
                  <TableCell className="font-semibold tabular-nums">{formatCurrency(sale.total, { currency: sale.currency })}</TableCell>
                  <TableCell><StatusBadge status={sale.status} /></TableCell>
                  <TableCell><div className="flex justify-end gap-1"><Button size="icon-sm" variant="ghost" asChild><Link to={`/sales/${sale.id}`} aria-label={`Ver ${sale.saleNumber}`}><Eye /></Link></Button>{canCancel && sale.status === "CONFIRMED" && <Button size="icon-sm" variant="ghost" className="text-red-600" onClick={() => cancel(sale)} disabled={actions.cancel.isPending} aria-label={`Cancelar ${sale.saleNumber}`}><Ban /></Button>}</div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </QueryState>
    </div>
  );
}
