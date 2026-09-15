import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/features/customers/components/field-error";
import type { CustomerFormProps, CustomerFormValues } from "@/features/customers/types/forms";
import { customerInput, formValues } from "@/features/customers/utils/customers-helpers";
import { customerFormSchema } from "@/features/customers/validations/customers.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

export function CustomerForm({
  customer,
  pending,
  submitLabel,
  onSubmit,
  onCancel,
  onDirtyChange,
}: CustomerFormProps) {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: formValues(customer),
  });
  const kind = useWatch({ control: form.control, name: "kind" });
  const isDirty = form.formState.isDirty;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (!isDirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const submit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(customerInput(values, customer));
    } catch {
      // Mutation hooks surface the error and the mounted form intentionally keeps its values.
    }
  });

  const cancel = () => {
    if (isDirty && !window.confirm("¿Descartar los cambios sin guardar?")) return;
    onCancel();
  };

  return (
    <form className="space-y-5" onSubmit={submit} noValidate>
      <div className="space-y-2">
        <Label htmlFor="customer-kind">Tipo de cliente</Label>
        <Select id="customer-kind" {...form.register("kind")}>
          <option value="INDIVIDUAL">Persona</option>
          <option value="BUSINESS">Empresa</option>
        </Select>
      </div>

      {kind === "INDIVIDUAL" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="customer-first-name">Nombre</Label>
            <Input
              id="customer-first-name"
              autoComplete="given-name"
              aria-invalid={Boolean(form.formState.errors.firstName)}
              aria-describedby={form.formState.errors.firstName ? "customer-first-name-error" : undefined}
              {...form.register("firstName")}
            />
            <FieldError
              id="customer-first-name-error"
              message={form.formState.errors.firstName?.message}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-last-name">Apellido</Label>
            <Input
              id="customer-last-name"
              autoComplete="family-name"
              aria-invalid={Boolean(form.formState.errors.lastName)}
              aria-describedby={form.formState.errors.lastName ? "customer-last-name-error" : undefined}
              {...form.register("lastName")}
            />
            <FieldError
              id="customer-last-name-error"
              message={form.formState.errors.lastName?.message}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="customer-business-name">Razón social</Label>
          <Input
            id="customer-business-name"
            autoComplete="organization"
            aria-invalid={Boolean(form.formState.errors.businessName)}
            aria-describedby={form.formState.errors.businessName ? "customer-business-error" : undefined}
            {...form.register("businessName")}
          />
          <FieldError
            id="customer-business-error"
            message={form.formState.errors.businessName?.message}
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customer-email">Email</Label>
          <Input
            id="customer-email"
            type="email"
            autoComplete="email"
            placeholder="nombre@ejemplo.com"
            aria-invalid={Boolean(form.formState.errors.email)}
            aria-describedby={form.formState.errors.email ? "customer-email-error" : undefined}
            {...form.register("email")}
          />
          <FieldError id="customer-email-error" message={form.formState.errors.email?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer-phone">Teléfono</Label>
          <Input
            id="customer-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+54 381 555 0101"
            aria-invalid={Boolean(form.formState.errors.phone)}
            aria-describedby={form.formState.errors.phone ? "customer-phone-error" : undefined}
            {...form.register("phone")}
          />
          <FieldError id="customer-phone-error" message={form.formState.errors.phone?.message} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customer-document-type">Tipo de documento</Label>
          <Select
            id="customer-document-type"
            aria-invalid={Boolean(form.formState.errors.documentType)}
            aria-describedby={form.formState.errors.documentType ? "customer-document-type-error" : undefined}
            {...form.register("documentType")}
          >
            <option value="">Sin documento</option>
            <option value="DNI">DNI</option>
            <option value="CUIT">CUIT</option>
            <option value="PASSPORT">Pasaporte</option>
            <option value="OTHER">Otro</option>
          </Select>
          <FieldError
            id="customer-document-type-error"
            message={form.formState.errors.documentType?.message}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer-document-number">Número</Label>
          <Input
            id="customer-document-number"
            inputMode="numeric"
            aria-invalid={Boolean(form.formState.errors.documentNumber)}
            aria-describedby={form.formState.errors.documentNumber ? "customer-document-number-error" : undefined}
            {...form.register("documentNumber")}
          />
          <FieldError
            id="customer-document-number-error"
            message={form.formState.errors.documentNumber?.message}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customer-notes">Notas internas</Label>
        <Textarea
          id="customer-notes"
          rows={3}
          placeholder="Preferencias o información útil para el equipo…"
          aria-invalid={Boolean(form.formState.errors.notes)}
          aria-describedby={form.formState.errors.notes ? "customer-notes-error" : undefined}
          {...form.register("notes")}
        />
        <FieldError id="customer-notes-error" message={form.formState.errors.notes?.message} />
      </div>

      <div className="flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={cancel} disabled={pending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : null}
          {pending ? "Guardando…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
