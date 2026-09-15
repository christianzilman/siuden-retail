import type { ComponentType } from "react";

export type QuickAction = {
  label: string;
  description: string;
  to: string;
  icon: ComponentType<{ className?: string }>;
  visible: boolean;
};
