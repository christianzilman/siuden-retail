import { useState, type CSSProperties } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { RegisterForm } from "./RegisterForm";
import { LoginForm } from "./LoginForm";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialView: "login" | "register";
  tenantSlug: string;
}

export const AuthDialog = ({
  open,
  onOpenChange,
  initialView,
  tenantSlug,
}: Props) => {
  const theme = {
    "--store-primary": "#74263A",
    "--store-secondary": "#312A2B",
    "--store-accent": "#B39155",
    "--store-background": "#F8F6F1",
    "--store-surface": "#FFFFFF",
    "--store-text": "#292526",
    "--store-muted": "#706869",
    "--store-hairline": "#E5DED4",
  } as CSSProperties;

  const [view, setView] = useState(initialView);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm" />
        <Dialog.Content
          style={theme}
          className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(92vw,32rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-[var(--store-background)] p-6 text-[var(--store-text)] shadow-2xl sm:p-9"
        >
          <Dialog.Close
            className="absolute right-4 top-4 grid size-10 place-items-center"
            aria-label="Cerrar"
          >
            <X />
          </Dialog.Close>
          <Dialog.Title className="pr-10 font-serif text-3xl">
            {view === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </Dialog.Title>
          <Dialog.Description className="mb-6 mt-2 text-sm leading-6 text-[var(--store-muted)]">
            Acceso exclusivo para clientes de esta tienda.
          </Dialog.Description>
          {view === "login" ? (
            <LoginForm tenantSlug={tenantSlug} />
          ) : (
            <RegisterForm tenantSlug={tenantSlug} />
          )}
          <button
            className="mt-6 text-sm underline underline-offset-4"
            onClick={() => setView(view === "login" ? "register" : "login")}
            type="button"
          >
            {view === "login" ? "No tengo cuenta" : "Ya tengo una cuenta"}
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
