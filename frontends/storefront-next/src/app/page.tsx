import { getTenantStoreData } from "@/features/catalog/api/catalog.api";
import { TenantStorefront } from "@/features/storefront/pages/tenant-storefront";

export default async function HomePage() {
  const store = await getTenantStoreData("rubi");

  if (!store) {
    return null;
  }

  return <TenantStorefront {...store} basePath="" />;
}
