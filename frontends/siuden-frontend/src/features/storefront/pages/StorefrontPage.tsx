import { useParams } from "react-router-dom";
import { AnnouncementBar } from "../components/AnnouncementBar";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { CategoryGrid } from "@/features/catalog/components/CategoryGrid";
import { ProductGrid } from "@/features/catalog/components/ProductGrid";
import { Benefits } from "../components/Benefits";
import { WhatsappBanner } from "../components/WhatsappBanner";
import { Footer } from "../components/Footer";
import { FloatingWhatsappButton } from "../components/FloatingWhatsappButton";
import {
  useCategories,
  useProducts,
  usePublicTenant,
} from "@/features/catalog/hooks/use-catalog";
import { productSort } from "@/features/catalog/types/catalog.types";
import { getStorefrontTheme } from "../utils/storefront-theme";
import { useTenantDocument } from "../hooks/use-tenant-document";

export const StorefrontPage = () => {
  const { tenantSlug = "rubi" } = useParams();
  const tenantQuery = usePublicTenant(tenantSlug);
  const categoriesQuery = useCategories(tenantSlug);
  const newestQuery = useProducts(tenantSlug, {
    pageSize: 5,
    sortBy: productSort.newest,
  });
  const categories = categoriesQuery.data ?? [];
  const newestProducts = newestQuery.data?.items ?? [];
  const tenant = tenantQuery.data;
  const tenantName = tenant?.brandName || tenant?.name || "Tienda";
  useTenantDocument(tenant);

  return (
    <div
      style={getStorefrontTheme(tenant)}
      className="min-h-screen overflow-x-clip bg-[var(--store-background)] font-[var(--store-body-font)] text-[var(--store-text)] [&_.font-serif]:font-[var(--store-heading-font)]"
    >
      <AnnouncementBar tenant={tenant} />
      <Header
        categories={categories}
        products={newestProducts}
        tenantName={tenantName}
        tenantSlug={tenantSlug}
        tenant={tenant}
      />
      <main>
        <Hero tenant={tenant} tenantName={tenantName} tenantSlug={tenantSlug} />
        <CategoryGrid
          categories={categories}
          loading={categoriesQuery.isLoading}
          tenantSlug={tenantSlug}
        />
        <div className="bg-white">
          <ProductGrid
            id="productos"
            eyebrow="Lo último de la tienda"
            title="Productos destacados"
            items={newestProducts}
            loading={newestQuery.isLoading}
            tenantSlug={tenantSlug}
          />
        </div>
        <Benefits />
        <WhatsappBanner tenant={tenant} />
      </main>
      <Footer
        categories={categories}
        tenantName={tenantName}
        tenantSlug={tenantSlug}
        tenant={tenant}
      />
      <FloatingWhatsappButton tenant={tenant} />
    </div>
  );
};
