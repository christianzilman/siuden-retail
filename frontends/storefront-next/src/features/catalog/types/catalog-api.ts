import type { StoreCategory, StoreProduct } from "@/features/catalog/types/storefront";
import type { StorefrontSettings, TenantConfig } from "@/features/tenant/types/tenant";

export type ApiCatalog = {
  tenant: {
    id: string; slug: string; name: string; defaultCurrency: string; timeZone: string; enabled: boolean;
    profile: { brandName: string; contactEmail: string | null; phone: string | null; addressLine: string | null; addressNumber: string | null; city: string | null; province: string | null; postalCode: string | null; countryCode: string } | null;
    settings: StorefrontSettings;
    theme: Partial<TenantConfig["theme"]> | null;
    contacts: Array<{ channelType: "WHATSAPP" | "FACEBOOK" | "INSTAGRAM" | "OTHER"; value: string | null; url: string | null; enabled: boolean; sortOrder: number }>;
  };
  categories: StoreCategory[];
  products: Array<Omit<StoreProduct, "status" | "price" | "compareAtPrice" | "stockStatus"> & { status: string }>;
};
