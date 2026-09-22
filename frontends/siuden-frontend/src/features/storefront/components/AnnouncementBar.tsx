import type { PublicTenant } from "@/features/catalog/types/catalog.types";

export const AnnouncementBar = ({ tenant }: { tenant?: PublicTenant }) => {
  if (!tenant?.announcementEnabled || !tenant.announcementText) return null;

  const content = tenant.announcementText;
  if (!tenant.announcementUrl) {
    return <div className="bg-[var(--store-primary)] px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[.22em] text-white sm:text-xs">{content}</div>;
  }

  return (
    <a
      className="block bg-[var(--store-primary)] px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[.22em] text-white sm:text-xs"
      href={tenant.announcementUrl}
      target="_blank"
      rel="noreferrer"
    >
      {content}
    </a>
  );
};
