import { ShieldCheck } from "lucide-react";

export function PrivacyNotice() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-sky-200 bg-sky-50/70 p-4 text-sm text-sky-950">
      <ShieldCheck className="mt-0.5 size-5 shrink-0 text-sky-700" aria-hidden="true" />
      <div>
        <p className="font-semibold">Datos de demostración</p>
        <p className="mt-0.5 leading-6 text-sky-800">
          Los clientes y sus operaciones son identidades ficticias creadas para probar el administrador.
        </p>
      </div>
    </div>
  );
}
