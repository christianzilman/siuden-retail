import { SectionHeading } from "@/components/ui/section-heading";
import { ArrowRight } from "lucide-react";
import { type Product } from "@/features/catalog/types/catalog.types";
import { Link } from "react-router-dom";
import { ProductCard } from "./ProductCard";

interface Props {
  id: string;
  eyebrow: string;
  title: string;
  items: Product[];
  tenantSlug: string;
  loading?: boolean;
}

export const ProductGrid = ({
  id,
  eyebrow,
  title,
  items,
  tenantSlug,
  loading = false,
}: Props) => {
  return (
    <section
      className="mx-auto w-[min(100%-2rem,86rem)] py-16 sm:py-20 lg:py-28"
      id={id}
    >
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        action={
          <Link
            className="hidden items-center gap-2 text-sm font-medium sm:flex"
            to={`/${tenantSlug}/productos`}
          >
            Ver todos los productos <ArrowRight className="size-4" />
          </Link>
        }
      />
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="animate-pulse" key={index}>
              <div className="aspect-[4/5] bg-[var(--store-hairline)]" />
              <div className="mt-4 h-4 w-2/3 bg-[var(--store-hairline)]" />
              <div className="mt-3 h-6 w-5/6 bg-[var(--store-hairline)]" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="border border-[var(--store-hairline)] bg-white px-6 py-12 text-center text-[var(--store-muted)]">
          Todavía no hay productos para mostrar.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((product, index) => (
            <ProductCard index={index} key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
