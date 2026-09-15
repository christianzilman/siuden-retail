import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldMessage } from "@/features/settings/components/field-message";
import type { ColorFieldName, StoreSettingsValues } from "@/features/settings/types/forms";
import { isHexColor } from "@/features/settings/utils/settings-helpers";
import { Controller, type Control } from "react-hook-form";

export function ColorField({
  control,
  name,
  label,
  fallback,
}: {
  control: Control<StoreSettingsValues>;
  name: ColorFieldName;
  label: string;
  fallback: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={name}>{label}</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={isHexColor(field.value) ? field.value : fallback}
              onChange={(event) => field.onChange(event.target.value.toUpperCase())}
              className="w-12 shrink-0 cursor-pointer p-1"
              aria-label={`Selector para ${label.toLowerCase()}`}
            />
            <Input
              id={name}
              ref={field.ref}
              name={field.name}
              value={field.value}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(event.target.value.toUpperCase())}
              spellCheck={false}
              aria-invalid={Boolean(fieldState.error)}
            />
          </div>
          <FieldMessage message={fieldState.error?.message} />
        </div>
      )}
    />
  );
}
