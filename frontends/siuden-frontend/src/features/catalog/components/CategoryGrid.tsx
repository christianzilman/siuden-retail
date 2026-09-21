import { SectionHeading } from "@/components/ui/section-heading";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { Category } from "../types/catalog.types";
import { categoryProductsHref } from "../utils/catalog.utils";
import {
  GOLD_IMAGE,
  HERO_IMAGE,
  SILVER_IMAGE,
} from "../data/storefront-content";

interface Props {
  tenantSlug: string;
  categories: Category[];
  loading?: boolean;
}

const CATEGORY_IMAGES = [
  GOLD_IMAGE,
  SILVER_IMAGE,
  HERO_IMAGE,
];

export const CategoryGrid = ({ categories, tenantSlug, loading }: Props) => {
  const visibleCategories = categories
    .filter((category) => category.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 5);

  return (
    <section
      className="mx-auto w-[min(100%-2rem,86rem)] py-16 sm:py-20 lg:py-28"
      id="categorias"
    >
      <SectionHeading
        eyebrow="Encontrá tu pieza"
        title="Colecciones para cada momento"
      />
      {loading ? (
        <div className="grid animate-pulse grid-cols-2 gap-3 md:grid-cols-4 md:auto-rows-64">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              className={cn(
                "min-h-60 bg-[var(--store-hairline)]",
                index === 0 && "col-span-2 min-h-96 md:row-span-2",
              )}
              key={index}
            />
          ))}
        </div>
      ) : visibleCategories.length === 0 ? (
        <p className="border border-[var(--store-hairline)] bg-white px-6 py-12 text-center text-[var(--store-muted)]">
          Las categorías estarán disponibles próximamente.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:auto-rows-64">
          {visibleCategories.map((category, index) => (
            <Link
              className={cn(
                "group relative min-h-60 overflow-hidden",
                index === 0 && "col-span-2 min-h-96 md:row-span-2",
              )}
              to={categoryProductsHref(tenantSlug, category)}
              key={category.id}
            >
              <img
                className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
                src={CATEGORY_IMAGES[index % CATEGORY_IMAGES.length]}
                alt={`Colección ${category.name}`}
              />
              <span className="absolute inset-0 bg-black/25 group-hover:bg-black/35" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white sm:p-7">
                <span>
                  <small className="block uppercase tracking-[.18em] text-white/80">
                    Colección {String(index + 1).padStart(2, "0")}
                  </small>
                  <strong className="mt-1 block font-serif text-2xl font-normal sm:text-3xl">
                    {category.name}
                  </strong>
                </span>
                <span className="grid size-10 place-items-center rounded-full border border-white/60">
                  <ArrowRight className="size-4" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
