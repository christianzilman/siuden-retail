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
import { storefrontTheme } from "../utils/storefront-theme";

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
  const tenantName = tenantQuery.data?.name ?? "Rubí";

  return (
    <div
      style={storefrontTheme}
      className="min-h-screen overflow-x-clip bg-[var(--store-background)] font-[Georgia] text-[var(--store-text)]"
    >
      <AnnouncementBar />
      <Header
        categories={categories}
        products={newestProducts}
        tenantName={tenantName}
        tenantSlug={tenantSlug}
      />
      <main>
        <Hero tenantName={tenantName} tenantSlug={tenantSlug} />
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
        <WhatsappBanner />
      </main>
      <Footer
        categories={categories}
        tenantName={tenantName}
        tenantSlug={tenantSlug}
      />
      <FloatingWhatsappButton />
    </div>
  );
};
