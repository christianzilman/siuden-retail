import { errorMessage } from "@/lib/error-message";

export function MutationErrorNotice({ error }: { error: unknown }) {
  return error ? (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
      No pudimos guardar todos los cambios. Tus datos siguen en el formulario. {errorMessage(error)}
    </div>
  ) : null;
}
