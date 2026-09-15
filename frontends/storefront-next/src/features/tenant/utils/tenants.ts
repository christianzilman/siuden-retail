import { tenants } from "@/config/tenants";

export const getTenantBySlug = (tenantSlug: string) =>
  tenants.find(
    (tenant) => tenant.slug === tenantSlug && tenant.enabled && tenant.settings.isPublished,
  );
