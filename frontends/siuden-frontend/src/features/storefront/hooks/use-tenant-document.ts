import type { PublicTenant } from "@/features/catalog/types/catalog.types";
import { useEffect } from "react";

export function useTenantDocument(tenant?: PublicTenant) {
  useEffect(() => {
    if (!tenant) return;

    document.title = tenant.brandName || tenant.name;
    const favicon = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    const previousFavicon = favicon?.href;
    if (favicon && tenant.faviconUrl) favicon.href = tenant.faviconUrl;

    return () => {
      if (favicon && previousFavicon) favicon.href = previousFavicon;
    };
  }, [tenant]);
}
