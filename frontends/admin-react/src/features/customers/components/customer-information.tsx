import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Customer } from "@/features/customers/types/customers";
import { Mail, MapPin, Phone, UserRound } from "lucide-react";

export function CustomerInformation({ customer }: { customer: Customer }) {
  const contactRows = [
    { label: "Email", value: customer.email, icon: Mail },
    { label: "Teléfono", value: customer.phone, icon: Phone },
    {
      label: "Documento",
      value:
        customer.documentType && customer.documentNumber
          ? `${customer.documentType} ${customer.documentNumber}`
          : null,
      icon: UserRound,
    },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Datos del cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {contactRows.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
                <p className="mt-0.5 text-sm">{value ?? "Sin informar"}</p>
              </div>
            </div>
          ))}
          <div className="border-t pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Notas internas
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-6">
              {customer.notes ?? "No hay notas para este cliente."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Direcciones</CardTitle>
        </CardHeader>
        <CardContent>
          {customer.addresses.length === 0 ? (
            <EmptyState
              compact
              className="min-h-44 border-0 bg-muted/35"
              title="Sin direcciones cargadas"
              description="Este cliente todavía no tiene una dirección asociada."
              icon={MapPin}
            />
          ) : (
            <div className="space-y-3">
              {customer.addresses.map((address) => (
                <div key={address.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">
                        {address.label ?? (address.isDefault ? "Dirección principal" : "Dirección")}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {address.street} {address.number ?? "s/n"}
                        {address.floor ? `, piso ${address.floor}` : ""}
                        {address.apartment ? `, depto. ${address.apartment}` : ""}
                        <br />
                        {address.city}, {address.province}
                        {address.postalCode ? ` (${address.postalCode})` : ""}
                      </p>
                    </div>
                    {address.isDefault ? <StatusBadge status="ACTIVE" label="Principal" /> : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
