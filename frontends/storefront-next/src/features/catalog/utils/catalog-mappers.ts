import type { ApiCatalog } from "@/features/catalog/types/catalog-api";
import type { StoreProduct } from "@/features/catalog/types/storefront";
import type { StorefrontSettings } from "@/features/tenant/types/tenant";

export const toStoreProduct = (record: ApiCatalog["products"][number]): StoreProduct | null => {
  if (record.status !== "PUBLISHED") return null;
  const variants = record.variants.filter((variant) => variant.enabled);

  if (variants.length === 0) return null;

  const prices = variants
    .map((variant) => variant.price)
    .filter((price): price is number => price !== null);
  const compareAtPrices = variants
    .map((variant) => variant.compareAtPrice)
    .filter((price): price is number => price !== null);
  const trackedVariants = variants.filter((variant) => variant.trackInventory);
  const canSell = variants.some(
    (variant) => !variant.trackInventory || variant.available > 0 || variant.allowBackorder,
  );
  const hasLowStock = trackedVariants.some((variant) => {
    return (
      variant.available > 0 &&
      variant.available <= 2
    );
  });

  return {
    ...record,
    status: "PUBLISHED",
    price: prices.length > 0 ? Math.min(...prices) : null,
    compareAtPrice: compareAtPrices.length > 0 ? Math.min(...compareAtPrices) : null,
    variants,
    stockStatus: !canSell ? "out-of-stock" : hasLowStock ? "low-stock" : "available",
  };
};

export const sortProducts = (products: StoreProduct[], settings: StorefrontSettings) => {
  const sorted = [...products];

  switch (settings.defaultCatalogSort) {
    case "NEWEST":
      return sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    case "PRICE_ASC":
      return sorted.sort((a, b) => (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY));
    case "PRICE_DESC":
      return sorted.sort((a, b) => (b.price ?? Number.NEGATIVE_INFINITY) - (a.price ?? Number.NEGATIVE_INFINITY));
    case "NAME_ASC":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "es"));
    case "FEATURED":
    default:
      return sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
};
