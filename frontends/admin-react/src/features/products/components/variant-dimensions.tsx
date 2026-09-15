import { NumberField } from "@/features/products/components/number-field";
import type { ProductFormValues } from "@/features/products/types/forms";
import { useWatch, type Control, type UseFormRegister } from "react-hook-form";

export function VariantDimensions({ control, register, index, name }: { control: Control<ProductFormValues>; register: UseFormRegister<ProductFormValues>; index: number; name: string }) {
  const variant = useWatch({ control, name: `variants.${index}` });
  return (
    <div className="rounded-lg border p-4">
      <p className="mb-4 text-sm font-semibold">{name || variant?.name || `Variante ${index + 1}`}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <NumberField id={`weight-${index}`} label="Peso (kg)" name={`variants.${index}.weightKg`} register={register} step="0.001" />
        <NumberField id={`height-${index}`} label="Alto (cm)" name={`variants.${index}.heightCm`} register={register} />
        <NumberField id={`width-${index}`} label="Ancho (cm)" name={`variants.${index}.widthCm`} register={register} />
        <NumberField id={`depth-${index}`} label="Profundidad (cm)" name={`variants.${index}.depthCm`} register={register} />
      </div>
    </div>
  );
}
