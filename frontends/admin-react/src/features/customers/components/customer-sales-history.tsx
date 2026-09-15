import { EmptyState } from "@/components/shared/empty-state";
import { QueryState } from "@/components/shared/query-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSalesQuery } from "@/features/sales/hooks/use-sales";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/format";
import { ArrowRight, ReceiptText } from "lucide-react";
import { Link } from "react-router-dom";

export function CustomerSalesHistory({ customerId }: { customerId: string }) {
  const sales = useSalesQuery({ customerId, pageSize: 10 });
  const items = sales.data?.items ?? [];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Historial de ventas</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Operaciones vinculadas a este cliente ficticio.
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/sales?customerId=${customerId}`}>
            Ver todas <ArrowRight />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <QueryState
          isLoading={sales.isLoading}
          isError={sales.isError}
          error={sales.error}
          onRetry={() => void sales.refetch()}
          isEmpty={Boolean(sales.data && items.length === 0)}
          loadingFallback={<div className="px-5 pb-5 text-sm text-muted-foreground">Cargando ventas…</div>}
          emptyFallback={
            <EmptyState
              compact
              className="m-5 mt-0 min-h-40 border-0 bg-muted/35"
              title="Sin ventas asociadas"
              description="Podés seleccionar este cliente al registrar una nueva venta."
              icon={ReceiptText}
            />
          }
        >
          <Table className="min-w-[720px]" scrollLabel="Ventas del cliente">
            <TableHeader>
              <TableRow>
                <TableHead>Venta</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead className="text-right">Unidades</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.saleNumber}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(sale.soldAt ?? sale.createdAt)}
                  </TableCell>
                  <TableCell>{sale.channel === "POS" ? "Punto de venta" : "Manual"}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(
                      sale.items.reduce((total, item) => total + item.quantity, 0),
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={sale.status} />
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {formatCurrency(sale.total, { currency: sale.currency })}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon-sm" asChild>
                      <Link to={`/sales/${sale.id}`} aria-label={`Ver venta ${sale.saleNumber}`}>
                        <ArrowRight />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </QueryState>
      </CardContent>
    </Card>
  );
}
