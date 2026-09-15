import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/features/products/components/field-error";
import type { ProductFormValues } from "@/features/products/types/forms";
import { numberOrNull } from "@/features/products/utils/products-helpers";
import { type UseFormRegister } from "react-hook-form";

export function NumberField({
  id,
  label,
  name,
  register,
  error,
  step = "0.01",
  placeholder,
}: {
  id: string;
  label: string;
  name: Parameters<UseFormRegister<ProductFormValues>>[0];
  register: UseFormRegister<ProductFormValues>;
  error?: string;
  step?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type="number" min="0" step={step} placeholder={placeholder} aria-invalid={Boolean(error)} {...register(name, { setValueAs: numberOrNull })} />
      <FieldError message={error} />
    </div>
  );
}
