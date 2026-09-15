import type { AuthView } from "@/features/auth/types/auth";

export function validateAuthForm(view: AuthView, data: FormData): string | null {
  if (view === "register" && data.get("password") !== data.get("passwordConfirmation")) {
    return "Las contraseñas no coinciden.";
  }
  if (String(data.get("password") ?? "").trim().length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  return null;
}
