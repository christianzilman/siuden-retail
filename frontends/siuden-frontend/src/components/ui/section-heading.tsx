import type { ReactNode } from "react";

interface Props {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}

export const SectionHeading = ({ eyebrow, title, action }: Props) => {
  return (
    <div className="mb-10 flex items-end justify-between gap-6 sm:mb-14">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[.2em] text-[var(--store-primary)]">
          {eyebrow}
        </p>
        <h2 className="max-w-[14ch] font-serif text-4xl font-normal leading-[.98] tracking-[-.04em] sm:text-6xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
};
