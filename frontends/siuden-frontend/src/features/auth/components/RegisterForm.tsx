import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Field } from "./Field";
import { Button } from "@/components/ui/button";
import {
  registerSchema,
  type RegisterValues,
} from "../validations/auth.validation";
import { loginCustomer, registerCustomer } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import { toast } from "sonner";

export const RegisterForm = ({
  tenantSlug,
  onSuccess,
}: {
  tenantSlug: string;
  onSuccess: () => void;
}) => {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });
  const registration = useMutation({
    mutationFn: async (values: RegisterValues) => {
      await registerCustomer(tenantSlug, values);

      try {
        const session = await loginCustomer(tenantSlug, {
          email: values.email,
          password: values.password,
        });
        return session;
      } catch {
        return null;
      }
    },
    onSuccess: (session) => {
      if (session) {
        setAuthenticated(session);
        toast.success("Cuenta creada. Sesión iniciada.");
      } else {
        toast.success("Cuenta creada. Ya podés iniciar sesión.");
      }
      onSuccess();
    },
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
      {registration.isError ? (
        <p className="text-sm text-[var(--store-primary)]">
          No se pudo crear la cuenta. Revisá los datos y que la API esté
          levantada.
        </p>
      ) : null}
    </form>
  );
};
