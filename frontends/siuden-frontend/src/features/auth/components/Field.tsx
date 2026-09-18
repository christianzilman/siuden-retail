import type { ComponentProps } from "react";

export const Field = ({
  label,
  error,
  ...props
}: ComponentProps<"input"> & { label: string; error?: string }) => {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium">{label}</span>
      <input
        className="h-11 border border-[var(--store-hairline)] bg-white px-3 outline-none focus:border-[var(--store-primary)]"
        {...props}
      />
      {error ? (
        <span className="text-xs text-[var(--store-primary)]">{error}</span>
      ) : null}
    </label>
  );
};
