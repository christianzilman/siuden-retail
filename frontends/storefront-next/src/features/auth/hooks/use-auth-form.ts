"use client";

import { loginStorefrontCustomer, registerStorefrontCustomer } from "@/features/auth/api/auth.api";
import type { AuthView, StorefrontSession } from "@/features/auth/types/auth";
import { validateAuthForm } from "@/features/auth/validations/auth.validation";
import { useState, type FormEvent } from "react";

type AuthFormOptions = {
  view: AuthView;
  tenantSlug: string;
  onAuthenticated: (session: StorefrontSession) => void;
  onClose: () => void;
};

export function useAuthForm({ view, tenantSlug, onAuthenticated, onClose }: AuthFormOptions) {
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (name: string) => String(data.get(name) ?? "").trim();

    const validationError = validateAuthForm(view, data);
    if (validationError) {
      setMessage(validationError);
      return;
    }

    setIsPending(true);
    setMessage("");
    try {
      const session =
        view === "register"
          ? await registerStorefrontCustomer({
            tenantSlug,
            firstName: value("firstName"),
            lastName: value("lastName"),
            email: value("email"),
            phone: value("phone") || undefined,
            password: value("password"),
          })
          : await loginStorefrontCustomer({
            tenantSlug,
            email: value("email"),
            password: value("password"),
          });
      onAuthenticated(session);
      onClose();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No pudimos completar la operación. Intentá nuevamente.",
      );
    } finally {
      setIsPending(false);
    }
  };

  return { message, setMessage, isPending, handleSubmit, clearMessage: () => setMessage("") };
}
