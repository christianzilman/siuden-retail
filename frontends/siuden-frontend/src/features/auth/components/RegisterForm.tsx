import { api } from "@/services/http-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Field } from "./Field";
import { Button } from "@/components/ui/button";

export const RegisterForm = ({ tenantSlug }: { tenantSlug: string }) => {
  const registerSchema = z
    .object({
      firstName: z.string().min(2, "Ingresá tu nombre"),
      lastName: z.string().min(2, "Ingresá tu apellido"),
      email: z.email("Ingresá un email válido"),
      phone: z.string().optional(),
      password: z.string().min(6, "Mínimo 6 caracteres"),
      passwordConfirmation: z.string().min(6, "Repetí la contraseña"),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      path: ["passwordConfirmation"],
      message: "Las contraseñas no coinciden",
    });

  type RegisterValues = z.infer<typeof registerSchema>;

  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });
  const registration = useMutation({
    mutationFn: (values: RegisterValues) =>
      api.post(`/api/tenants/${tenantSlug}/customers`, values),
    onSuccess: () => setMessage("Cuenta creada. Ya podés iniciar sesión."),
  });
  return (
    <form
      className="grid gap-4"
      onSubmit={handleSubmit((values) => registration.mutate(values))}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Nombre"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Field
          label="Apellido"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>
      <Field
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Field
        label="Teléfono (opcional)"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <Field
        label="Contraseña"
        type="password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Field
        label="Repetir contraseña"
        type="password"
        error={errors.passwordConfirmation?.message}
        {...register("passwordConfirmation")}
      />
      <Button disabled={registration.isPending} type="submit">
        {registration.isPending ? "Creando…" : "Crear cuenta"}
      </Button>
      {message ? <p className="text-sm text-green-700">{message}</p> : null}
      {registration.isError ? (
        <p className="text-sm text-[var(--store-primary)]">
          No se pudo crear la cuenta. Revisá los datos y que la API esté
          levantada.
        </p>
      ) : null}
    </form>
  );
};
