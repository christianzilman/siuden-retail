import type { ApiCatalog } from "@/features/catalog/types/catalog-api";
import type { StoreProduct } from "@/features/catalog/types/storefront";
import { sortProducts, toStoreProduct } from "@/features/catalog/utils/catalog-mappers";
import { getTenantBySlug } from "@/features/tenant/utils/tenants";

export const getTenantStoreData = async (tenantSlug: string) => {
  const configuredTenant = getTenantBySlug(tenantSlug);

  if (!configuredTenant) {
    return undefined;
  }
  const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api/v1").replace(/\/$/, "");
  try {
    const response = await fetch(`${baseUrl}/storefront/catalog/${encodeURIComponent(tenantSlug)}`, { cache: "no-store" });
    if (!response.ok) return undefined;
    const api = await response.json() as ApiCatalog;
    const tenant = {
      ...configuredTenant,
      id: api.tenant.id,
      name: api.tenant.profile?.brandName ?? api.tenant.name,
      defaultCurrency: api.tenant.defaultCurrency,
      timeZone: api.tenant.timeZone,
      enabled: api.tenant.enabled,
      contactEmail: api.tenant.profile?.contactEmail ?? null,
      phone: api.tenant.profile?.phone ?? null,
      addressLine: api.tenant.profile?.addressLine ?? null,
      addressNumber: api.tenant.profile?.addressNumber ?? null,
      city: api.tenant.profile?.city ?? null,
      province: api.tenant.profile?.province ?? null,
      postalCode: api.tenant.profile?.postalCode ?? null,
      countryCode: api.tenant.profile?.countryCode ?? "AR",
      settings: api.tenant.settings,
      theme: { ...configuredTenant.theme, ...(api.tenant.theme ?? {}) },
      contactChannels: api.tenant.contacts.flatMap((channel) => channel.value && channel.url ? [{ type: channel.channelType, value: channel.value, url: channel.url, enabled: channel.enabled, sortOrder: channel.sortOrder }] : []),
    };
    const products = api.products
      .map(toStoreProduct)
      .filter((product): product is StoreProduct => product !== null);
    const allCategories = api.categories
      .filter((category) => category.isVisible)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    return {
      tenant,
      allCategories,
      categories: allCategories.filter((category) => category.parentId === null),
      products: sortProducts(products, tenant.settings),
    };
  } catch {
    return undefined;
  }
};
