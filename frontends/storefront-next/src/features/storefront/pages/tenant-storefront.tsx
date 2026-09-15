import { CategoryGrid } from "@/features/catalog/components/category-grid";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import type { StoreCategory, StoreProduct } from "@/features/catalog/types/storefront";
import { AnnouncementBar } from "@/features/storefront/components/announcement-bar";
import { Hero } from "@/features/storefront/components/hero";
import { StoreBenefits } from "@/features/storefront/components/store-benefits";
import { StoreFooter } from "@/features/storefront/components/store-footer";
import { StoreHeader } from "@/features/storefront/components/store-header";
import { WhatsappBanner } from "@/features/storefront/components/whatsapp-banner";
import { WhatsappFloatingButton } from "@/features/storefront/components/whatsapp-floating-button";
import type { TenantConfig } from "@/features/tenant/types/tenant";
import { getStorefrontThemeStyles } from "@/features/tenant/utils/storefront-theme";

type TenantStorefrontProps = {
  allCategories: StoreCategory[];
  basePath?: string;
  categories: StoreCategory[];
  products: StoreProduct[];
  tenant: TenantConfig;
};

export function TenantStorefront({ allCategories, basePath = "", categories, products, tenant }: TenantStorefrontProps) {
  const featuredProducts = products.filter((product) => product.featured);
  const remainingProducts = products.filter((product) => !product.featured);
  const themeStyles = getStorefrontThemeStyles(tenant);

  return (
    <div className="storefront-root" style={themeStyles}>
      <a className="skip-link" href="#contenido-principal">Saltar al contenido</a>
      <AnnouncementBar
        href={tenant.theme.announcementUrl}
        message={tenant.theme.announcementEnabled ? tenant.theme.announcementText ?? undefined : undefined}
      />
      <StoreHeader allCategories={allCategories} basePath={basePath} products={products} tenant={tenant} />
      <main id="contenido-principal">
        <Hero tenant={tenant} />
        <CategoryGrid allCategories={allCategories} basePath={basePath} categories={categories} tenantName={tenant.name} />
        <div className="bg-[var(--store-surface)]">
          <ProductGrid eyebrow="Elegidos para vos" id="productos" products={featuredProducts} showPrices={tenant.settings.showPrices} title="Productos destacados" />
        </div>
        <StoreBenefits benefits={tenant.storefront.benefits} tenantName={tenant.shortName} />
        <ProductGrid eyebrow="Catálogo Rubí" id="novedades" products={remainingProducts} showPrices={tenant.settings.showPrices} title="Más piezas" />
        <WhatsappBanner tenant={tenant} />
      </main>
      <StoreFooter allCategories={allCategories} basePath={basePath} categories={categories} tenant={tenant} />
      <WhatsappFloatingButton tenant={tenant} />
    </div>
  );
}
