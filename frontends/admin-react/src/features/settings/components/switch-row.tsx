import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function SwitchRow({
  id,
  title,
  description,
  checked,
  disabled,
  onCheckedChange,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-5 rounded-lg border bg-muted/20 p-4">
      <div className="space-y-1">
        <Label htmlFor={id}>{title}</Label>
        <p className="text-sm leading-5 text-muted-foreground">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-label={title}
      />
    </div>
  );
}
