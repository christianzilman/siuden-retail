import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { RegisterForm } from "./RegisterForm";
import { LoginForm } from "./LoginForm";
import type { PublicTenant } from "@/features/catalog/types/catalog.types";
import { getStorefrontTheme } from "@/features/storefront/utils/storefront-theme";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialView: "login" | "register";
  tenantSlug: string;
  tenant?: PublicTenant;
}

export const AuthDialog = ({
  open,
  onOpenChange,
  initialView,
  tenantSlug,
  tenant,
}: Props) => {
  const [view, setView] = useState(initialView);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm" />
        <Dialog.Content
          style={getStorefrontTheme(tenant)}
          className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(92vw,32rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-[var(--store-background)] p-6 font-[var(--store-body-font)] text-[var(--store-text)] shadow-2xl sm:p-9 [&_.font-serif]:font-[var(--store-heading-font)]"
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
            <LoginForm
              tenantSlug={tenantSlug}
              onSuccess={() => onOpenChange(false)}
            />
          ) : (
            <RegisterForm
              tenantSlug={tenantSlug}
              onSuccess={() => onOpenChange(false)}
            />
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
