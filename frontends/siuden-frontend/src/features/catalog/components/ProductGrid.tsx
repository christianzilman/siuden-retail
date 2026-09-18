import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "cn";
import { ArrowRight, ChevronDown } from "lucide-react";
import { type Product } from "@/features/catalog/data/mocks";
import { formatPrice } from "@/lib/format";

interface Props {
  id: string;
  eyebrow: string;
  title: string;
  items: Product[];
}

export const ProductGrid = ({ id, eyebrow, title, items }: Props) => {
  return (
    <section
      className="mx-auto w-[min(100%-2rem,86rem)] py-16 sm:py-20 lg:py-28"
      id={id}
    >
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        action={
          <a
            className="hidden items-center gap-2 text-sm font-medium sm:flex"
            href="#categorias"
          >
            Ver categorías <ArrowRight className="size-4" />
          </a>
        }
      />
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
        {items.map((product, index) => (
          <article id={`producto-${product.id}`} key={product.id}>
            <div className="group relative aspect-[4/5] overflow-hidden bg-white">
              <img
                className={cn(
                  "size-full object-cover transition duration-700 group-hover:scale-105",
                  index % 3 === 1 && "object-left",
                  index % 3 === 2 && "object-right",
                )}
                src={product.image}
                alt={`${product.name} en ${product.material}`}
              />
              {product.isNew ? (
                <span className="absolute left-3 top-3 bg-white px-2.5 py-1 text-xs uppercase tracking-[.14em] text-[var(--store-primary)]">
                  Nuevo
                </span>
              ) : null}
            </div>
            <div className="pt-4">
              <div className="flex flex-col justify-between gap-2 sm:flex-row">
                <div>
                  <p className="text-xs uppercase tracking-[.12em] text-[var(--store-muted)]">
                    {product.material}
                  </p>
                  <h3 className="mt-1 font-serif text-xl sm:text-2xl">
                    {product.name}
                  </h3>
                </div>
                <span
                  className={cn(
                    "text-xs text-[var(--store-muted)]",
                    product.stock !== "Disponible" &&
                      "text-[var(--store-primary)]",
                  )}
                >
                  {product.stock}
                </span>
              </div>
              <p className="mt-3 font-medium">{formatPrice(product.price)}</p>
              <details className="mt-3 border-t border-[var(--store-hairline)] pt-3">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm">
                  Ver detalle <ChevronDown className="size-4" />
                </summary>
                <p className="pt-3 text-sm leading-6 text-[var(--store-muted)]">
                  Descripción pendiente. Acá podés mostrar material, medidas,
                  variantes y cuidados.
                </p>
              </details>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
