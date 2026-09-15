import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { QueryState } from "@/components/shared/query-state";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePermission } from "@/features/auth/hooks/use-auth";
import { CustomerForm } from "@/features/customers/components/customer-form";
import { CustomerInformation } from "@/features/customers/components/customer-information";
import { CustomerSalesHistory } from "@/features/customers/components/customer-sales-history";
import { PrivacyNotice } from "@/features/customers/components/privacy-notice";
import { useCustomerMutations, useCustomerQuery } from "@/features/customers/hooks/use-customers";
import { customerName, kindLabels, sourceLabels } from "@/features/customers/utils/customers-helpers";
import { formatCurrency, formatDate, formatDateTime, formatNumber } from "@/lib/format";
import { ArrowLeft, CalendarDays, CircleDollarSign, Pencil, ReceiptText, UserCheck, UserRound, UserX } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

export function CustomerDetailPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const customerQuery = useCustomerQuery(customerId);
  const mutations = useCustomerMutations(customerId);
  const canWrite = usePermission("customers.write");
  const [editing, setEditing] = useState(false);
  const customer = customerQuery.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title={customer ? customerName(customer) : "Detalle del cliente"}
        description={
          customer
            ? `${kindLabels[customer.kind]} · Alta ${formatDate(customer.createdAt)}`
            : "Información y actividad del cliente."
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link to="/customers">
                <ArrowLeft /> Volver
              </Link>
            </Button>
            {customer && canWrite && !editing ? (
              <>
                <Button variant="outline" onClick={() => setEditing(true)}>
                  <Pencil /> Editar
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant={customer.status === "BLOCKED" ? "outline" : "destructive"}>
                      {customer.status === "BLOCKED" ? <UserCheck /> : <UserX />}
                      {customer.status === "BLOCKED" ? "Desbloquear" : "Bloquear"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {customer.status === "BLOCKED" ? "¿Desbloquear cliente?" : "¿Bloquear cliente?"}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {customer.status === "BLOCKED"
                          ? "El cliente volverá a quedar disponible para las operaciones del comercio."
                          : "El historial se conservará, pero el cliente quedará marcado como bloqueado."}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={mutations.setStatus.isPending}>
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        disabled={mutations.setStatus.isPending}
                        className={buttonVariants({
                          variant: customer.status === "BLOCKED" ? "default" : "destructive",
                        })}
                        onClick={() =>
                          mutations.setStatus.mutate(
                            customer.status === "BLOCKED" ? "ACTIVE" : "BLOCKED",
                          )
                        }
                      >
                        {mutations.setStatus.isPending ? "Guardando…" : "Confirmar"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : null}
          </div>
        }
      />

      <QueryState
        isLoading={customerQuery.isLoading}
        isError={customerQuery.isError}
        error={customerQuery.error}
        onRetry={() => void customerQuery.refetch()}
        isEmpty={!customer}
        emptyFallback={
          <EmptyState
            title="Cliente no disponible"
            description="Volvé al listado para seleccionar otro cliente."
            icon={UserRound}
            action={
              <Button variant="outline" asChild>
                <Link to="/customers">Volver a clientes</Link>
              </Button>
            }
          />
        }
      >
        {customer ? (
          <div className="space-y-6">
            <PrivacyNotice />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Estado"
                value={<StatusBadge status={customer.status} />}
                icon={customer.status === "BLOCKED" ? UserX : UserCheck}
                tone={customer.status === "BLOCKED" ? "danger" : "success"}
              />
              <StatCard
                label="Ventas confirmadas"
                value={formatNumber(customer.salesCount, 0)}
                icon={ReceiptText}
              />
              <StatCard
                label="Total gastado"
                value={formatCurrency(customer.totalSpent)}
                icon={CircleDollarSign}
                tone="success"
              />
              <StatCard
                label="Cliente desde"
                value={formatDate(customer.createdAt)}
                icon={CalendarDays}
              />
            </div>

            {editing ? (
              <Card>
                <CardHeader>
                  <CardTitle>Editar cliente</CardTitle>
                </CardHeader>
                <CardContent>
                  <CustomerForm
                    key={customer.id}
                    customer={customer}
                    pending={mutations.update.isPending}
                    submitLabel="Guardar cambios"
                    onCancel={() => setEditing(false)}
                    onSubmit={async (input) => {
                      await mutations.update.mutateAsync(input);
                      setEditing(false);
                    }}
                  />
                </CardContent>
              </Card>
            ) : (
              <CustomerInformation customer={customer} />
            )}

            <CustomerSalesHistory customerId={customer.id} />

            <Card>
              <CardContent className="flex flex-col gap-3 p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Origen: <strong className="font-medium text-foreground">{sourceLabels[customer.source]}</strong>
                </span>
                <span>
                  Última actualización: {formatDateTime(customer.updatedAt)}
                </span>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </QueryState>
    </div>
  );
}
