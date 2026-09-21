import { benefits } from "@/features/catalog/data/storefront-content";

export const Benefits = () => {
  return (
    <section className="border-y border-[var(--store-hairline)] bg-white">
      <div className="mx-auto grid w-[min(100%-2rem,86rem)] divide-y divide-[var(--store-hairline)] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
        {benefits.map(({ icon: Icon, title, description }) => (
          <div className="flex items-start gap-4 px-3 py-8 lg:px-7" key={title}>
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[var(--store-accent)] text-[var(--store-primary)]">
              <Icon className="size-5 text-[var(--store-primary)]" />
            </span>
            <span>
              <strong className="block text-sm font-medium">{title}</strong>
              <small className="mt-1 block text-sm leading-5 text-[var(--store-muted)]">
                {description}
              </small>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
