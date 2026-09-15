import { type ReactNode } from "react";

export function Detail({ label, value }: { label: string; value: ReactNode }) {
  return <div className="flex items-start justify-between gap-4"><span className="text-muted-foreground">{label}</span><span className="text-right font-medium">{value}</span></div>;
}
