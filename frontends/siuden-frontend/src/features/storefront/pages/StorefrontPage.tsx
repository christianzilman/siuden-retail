import type { CSSProperties } from "react";
import { useParams } from "react-router-dom";
import { AnnouncementBar } from "../components/AnnouncementBar";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { products } from "@/features/catalog/data/mocks";
import { CategoryGrid } from "@/features/catalog/components/CategoryGrid";
import { ProductGrid } from "@/features/catalog/components/ProductGrid";
import { Benefits } from "../components/Benefits";
import { WhatsappBanner } from "../components/WhatsappBanner";
import { Footer } from "../components/Footer";
import { MessageCircle } from "lucide-react";

export const StorefrontPage = () => {
  const theme = {
    "--store-primary": "#74263A",
    "--store-secondary": "#312A2B",
    "--store-accent": "#B39155",
    "--store-background": "#F8F6F1",
    "--store-surface": "#FFFFFF",
    "--store-text": "#292526",
    "--store-muted": "#706869",
    "--store-hairline": "#E5DED4",
  } as CSSProperties;

  const { tenantSlug = "rubi" } = useParams();
  return (
    <div
      style={theme}
      className="min-h-screen overflow-x-clip bg-[var(--store-background)] font-[Georgia] text-[var(--store-text)]"
    >
      <AnnouncementBar />
      <Header tenantSlug={tenantSlug} />
      <main>
        <Hero />
        <CategoryGrid tenantSlug={tenantSlug} />
        <div className="bg-white">
          <ProductGrid
            id="productos"
            eyebrow="Elegidos para vos"
            title="Productos destacados"
            items={products.slice(0, 4)}
          />
        </div>
        <Benefits />
        <ProductGrid
          id="novedades"
          eyebrow="Catálogo Rubí"
          title="Más piezas"
          items={products.slice(4)}
        />
        <WhatsappBanner />
      </main>
      <Footer tenantSlug={tenantSlug} />
      <a
        className="fixed bottom-5 right-5 z-30 grid size-14 place-items-center rounded-full bg-[var(--store-primary)] text-white shadow-xl"
        href="https://wa.me/5493816776136"
        target="_blank"
        rel="noreferrer"
        aria-label="Consultar por WhatsApp"
      >
        <MessageCircle className="size-6" />
      </a>
    </div>
  );
};
