import { CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export function SectionTitle({ icon: Icon, title, description }: { icon: typeof Package; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground"><Icon className="size-4.5" /></span>
      <div><CardTitle>{title}</CardTitle><p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p></div>
    </div>
  );
}
