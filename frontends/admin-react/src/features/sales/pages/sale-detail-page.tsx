import { PageHeader, QueryState, StatusBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePermission } from "@/features/auth/hooks/use-auth";
import { Detail } from "@/features/sales/components/detail";
import { useSaleMutations, useSaleQuery } from "@/features/sales/hooks/use-sales";
import { channelLabel, customerName } from "@/features/sales/utils/sales-helpers";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { Printer, RotateCcw } from "lucide-react";
import { useParams } from "react-router-dom";

export function SaleDetailPage() {
  const { saleId } = useParams();
  const sale = useSaleQuery(saleId);
  const actions = useSaleMutations();
  const canCancel = usePermission("sales.cancel");

  const cancel = async () => {
    if (!sale.data || !window.confirm(`¿Cancelar ${sale.data.saleNumber}? Esta acción creará un movimiento SALE_REVERSAL.`)) return;
    await actions.cancel.mutateAsync({ saleId: sale.data.id, reason: "Cancelación desde el detalle de venta" });
    await sale.refetch();
  };

  return (
    <div className="space-y-6 print:p-0">
      <PageHeader title={sale.data?.saleNumber ?? "Detalle de venta"} description="Comprobante histórico con snapshots de producto y precio." actions={<><Button variant="outline" onClick={() => window.print()}><Printer />Imprimir</Button>{canCancel && sale.data?.status === "CONFIRMED" && <Button variant="destructive" onClick={cancel} disabled={actions.cancel.isPending}><RotateCcw />{actions.cancel.isPending ? "Cancelando…" : "Cancelar venta"}</Button>}</>} />
      <QueryState isLoading={sale.isPending} isError={sale.isError} error={sale.error} onRetry={() => sale.refetch()}>
        {sale.data && (
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <Card>
              <CardHeader><CardTitle>Artículos</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {sale.data.items.map((item) => <div key={item.id} className="flex items-start justify-between gap-4 rounded-lg border p-4"><div><p className="font-medium">{item.productNameSnapshot}</p><p className="mt-1 text-sm text-muted-foreground">{item.variantNameSnapshot ?? "Variante eliminada"}{item.skuSnapshot ? ` · ${item.skuSnapshot}` : ""}</p><p className="mt-2 text-xs text-muted-foreground">{item.quantity} × {formatCurrency(item.unitPrice)}</p></div><p className="font-semibold tabular-nums">{formatCurrency(item.lineTotal)}</p></div>)}
                <div className="flex items-center justify-between border-t pt-4 text-lg font-bold"><span>Total</span><span>{formatCurrency(sale.data.total, { currency: sale.data.currency })}</span></div>
              </CardContent>
            </Card>
            <div className="space-y-5">
              <Card><CardHeader><CardTitle>Información</CardTitle></CardHeader><CardContent className="space-y-4 text-sm">
                <Detail label="Estado" value={<StatusBadge status={sale.data.status} />} />
                <Detail label="Pago" value={<StatusBadge status={sale.data.paymentStatus} />} />
                <Detail label="Cliente" value={customerName(sale.data)} />
                <Detail label="Canal" value={channelLabel[sale.data.channel]} />
                <Detail label="Fecha" value={formatDateTime(sale.data.soldAt ?? sale.data.createdAt)} />
                <Detail label="Registrada por" value={sale.data.createdByName ?? "Sistema"} />
              </CardContent></Card>
              {sale.data.notes && <Card><CardHeader><CardTitle>Notas</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{sale.data.notes}</p></CardContent></Card>}
            </div>
          </div>
        )}
      </QueryState>
    </div>
  );
}
