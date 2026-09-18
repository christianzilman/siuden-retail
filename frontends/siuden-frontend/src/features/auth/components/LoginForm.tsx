import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Field } from "./Field";
import { api } from "@/services/http-client";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

export const LoginForm = ({ tenantSlug }: { tenantSlug: string }) => {
  const loginSchema = z.object({
    email: z.email("Ingresá un email válido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
  });

  type LoginValues = z.infer<typeof loginSchema>;

  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  const login = useMutation({
    mutationFn: (values: LoginValues) =>
      api.post(`/api/tenants/${tenantSlug}/auth/customer/login`, values),
    onSuccess: () => setMessage("Sesión iniciada correctamente."),
  });
  return (
    <form
      className="grid gap-4"
      onSubmit={handleSubmit((values) => login.mutate(values))}
    >
      <Field
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Field
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button disabled={login.isPending} type="submit">
        {login.isPending ? "Ingresando…" : "Iniciar sesión"}
      </Button>
      {message ? <p className="text-sm text-green-700">{message}</p> : null}
      {login.isError ? (
        <p className="text-sm text-[var(--store-primary)]">
          No se pudo iniciar sesión. Revisá los datos y que la API esté
          levantada.
        </p>
      ) : null}
    </form>
  );
};
