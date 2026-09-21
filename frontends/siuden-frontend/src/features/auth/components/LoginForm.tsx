import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Field } from "./Field";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginCustomer } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import { loginSchema, type LoginValues } from "../validations/auth.validation";

interface Props {
  tenantSlug: string;
  onSuccess: () => void;
}

export const LoginForm = ({ tenantSlug, onSuccess }: Props) => {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  const login = useMutation({
    mutationFn: (values: LoginValues) => loginCustomer(tenantSlug, values),
    onSuccess: (result) => {
      setAuthenticated(result);
      onSuccess();
    },
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
      {login.isError ? (
        <p className="text-sm text-[var(--store-primary)]">
          No se pudo iniciar sesión. Revisá los datos y que la API esté
          levantada.
        </p>
      ) : null}
    </form>
  );
};
