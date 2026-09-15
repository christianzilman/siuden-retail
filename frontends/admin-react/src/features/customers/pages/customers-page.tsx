import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { QueryState } from "@/components/shared/query-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePermission } from "@/features/auth/hooks/use-auth";
import { CustomerForm } from "@/features/customers/components/customer-form";
import { PrivacyNotice } from "@/features/customers/components/privacy-notice";
import { useCustomerMutations, useCustomersQuery } from "@/features/customers/hooks/use-customers";
import type { CustomerKind, CustomerStatus } from "@/features/customers/types/customers";
import { customerInitials, customerName, kindLabels, sourceLabels } from "@/features/customers/utils/customers-helpers";
import { formatCurrency, formatNumber } from "@/lib/format";
import { ArrowLeft, ArrowRight, Plus, UsersRound } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { Link } from "react-router-dom";

export function CustomersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CustomerStatus | "ALL">("ALL");
  const [kind, setKind] = useState<CustomerKind | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [createDirty, setCreateDirty] = useState(false);
  const deferredSearch = useDeferredValue(search.trim());
  const canWrite = usePermission("customers.write");
  const customers = useCustomersQuery({
    search: deferredSearch || undefined,
    status,
    kind,
    page,
    pageSize: 12,
  });
  const mutations = useCustomerMutations();
  const result = customers.data;
  const hasFilters = Boolean(search) || status !== "ALL" || kind !== "ALL";

  const clearFilters = () => {
    setSearch("");
    setStatus("ALL");
    setKind("ALL");
    setPage(1);
  };

  const requestCreateOpen = (open: boolean) => {
    if (!open && createDirty && !window.confirm("¿Descartar los datos del cliente sin guardar?")) {
      return;
    }
    setCreateOpen(open);
    if (!open) setCreateDirty(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Consultá la actividad y mantené actualizados los datos de contacto."
        actions={
          canWrite ? (
            <Button onClick={() => setCreateOpen(true)}>
              <Plus /> Nuevo cliente
            </Button>
          ) : null
        }
      />

      <PrivacyNotice />

      <Card>
        <CardContent className="p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(280px,1fr)_220px_220px_auto]">
            <div className="relative">
              <UsersRound
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="pl-9"
                placeholder="Buscar por nombre, email o teléfono…"
                aria-label="Buscar clientes"
              />
            </div>
            <Select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as CustomerStatus | "ALL");
                setPage(1);
              }}
              aria-label="Filtrar por estado"
            >
              <option value="ALL">Todos los estados</option>
              <option value="ACTIVE">Activos</option>
              <option value="BLOCKED">Bloqueados</option>
              <option value="ARCHIVED">Archivados</option>
            </Select>
            <Select
              value={kind}
              onChange={(event) => {
                setKind(event.target.value as CustomerKind | "ALL");
                setPage(1);
              }}
              aria-label="Filtrar por tipo"
            >
              <option value="ALL">Personas y empresas</option>
              <option value="INDIVIDUAL">Personas</option>
              <option value="BUSINESS">Empresas</option>
            </Select>
            {hasFilters ? (
              <Button variant="ghost" onClick={clearFilters}>
                Limpiar
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <QueryState
        isLoading={customers.isLoading}
        isError={customers.isError}
        error={customers.error}
        onRetry={() => void customers.refetch()}
        isEmpty={Boolean(result && result.items.length === 0)}
        emptyFallback={
          <EmptyState
            title={hasFilters ? "No encontramos clientes" : "Todavía no hay clientes"}
            description={
              hasFilters
                ? "Probá con otros filtros o revisá el texto de búsqueda."
                : "Creá el primer cliente ficticio para comenzar la demostración."
            }
            icon={UsersRound}
            action={
              hasFilters ? (
                <Button variant="outline" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              ) : canWrite ? (
                <Button onClick={() => setCreateOpen(true)}>
                  <Plus /> Nuevo cliente
                </Button>
              ) : null
            }
          />
        }
      >
        {result ? (
          <>
            <Card className="hidden overflow-hidden md:block">
              <Table className="min-w-[860px]" scrollLabel="Listado de clientes">
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Origen</TableHead>
                    <TableHead className="text-right">Ventas</TableHead>
                    <TableHead className="text-right">Total gastado</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.items.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                            {customerInitials(customer)}
                          </span>
                          <div className="min-w-0">
                            <Link
                              to={`/customers/${customer.id}`}
                              className="font-semibold hover:text-primary hover:underline"
                            >
                              {customerName(customer)}
                            </Link>
                            <p className="text-xs text-muted-foreground">{kindLabels[customer.kind]}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p>{customer.email ?? "Sin email"}</p>
                        <p className="text-xs text-muted-foreground">
                          {customer.phone ?? "Sin teléfono"}
                        </p>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {sourceLabels[customer.source]}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatNumber(customer.salesCount, 0)}
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {formatCurrency(customer.totalSpent)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={customer.status} />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon-sm" asChild>
                          <Link
                            to={`/customers/${customer.id}`}
                            aria-label={`Ver cliente ${customerName(customer)}`}
                          >
                            <ArrowRight />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <div className="grid gap-3 md:hidden">
              {result.items.map((customer) => (
                <Link
                  key={customer.id}
                  to={`/customers/${customer.id}`}
                  className="rounded-lg border bg-card p-4 shadow-soft transition-colors hover:border-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                      {customerInitials(customer)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">{customerName(customer)}</p>
                          <p className="text-xs text-muted-foreground">
                            {kindLabels[customer.kind]} · {sourceLabels[customer.source]}
                          </p>
                        </div>
                        <StatusBadge status={customer.status} />
                      </div>
                      <p className="mt-3 truncate text-sm text-muted-foreground">
                        {customer.email ?? customer.phone ?? "Sin datos de contacto"}
                      </p>
                      <div className="mt-3 flex justify-between border-t pt-3 text-sm">
                        <span className="text-muted-foreground">
                          {customer.salesCount} ventas
                        </span>
                        <span className="font-semibold">{formatCurrency(customer.totalSpent)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {result.totalPages > 1 ? (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Página {result.page} de {result.totalPages} · {result.total} clientes
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={result.page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                  >
                    <ArrowLeft /> Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={result.page >= result.totalPages}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    Siguiente <ArrowRight />
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </QueryState>

      <Dialog open={createOpen} onOpenChange={requestCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo cliente</DialogTitle>
            <DialogDescription>
              Creá una identidad ficticia para usar en ventas de demostración.
            </DialogDescription>
          </DialogHeader>
          <CustomerForm
            pending={mutations.create.isPending}
            submitLabel="Crear cliente"
            onDirtyChange={setCreateDirty}
            onCancel={() => {
              setCreateDirty(false);
              setCreateOpen(false);
            }}
            onSubmit={async (input) => {
              await mutations.create.mutateAsync(input);
              setCreateDirty(false);
              setCreateOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
