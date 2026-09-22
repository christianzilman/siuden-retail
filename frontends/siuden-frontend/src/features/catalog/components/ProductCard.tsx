import type { Product } from "@/features/catalog/types/catalog.types";
import { getProductImageUrl } from "@/features/catalog/utils/catalog.utils";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ProductCardProps {
  index: number;
  product: Product;
  tenantSlug: string;
}

export function ProductCard({ index, product, tenantSlug }: ProductCardProps) {
  return (
    <article id={`producto-${product.id}`}>
      <Link
        aria-label={`Ver detalle de ${product.name}`}
        className="group relative block aspect-[4/5] overflow-hidden bg-white"
        to={`/${tenantSlug}/productos/${product.slug}`}
      >
        <img
          className={cn(
            "size-full object-cover transition duration-700 group-hover:scale-105",
            index % 3 === 1 && "object-left",
            index % 3 === 2 && "object-right",
          )}
          src={getProductImageUrl(product.imageUrl, index)}
          alt={product.name}
          loading="lazy"
        />
        {index === 0 ? (
          <span className="absolute left-3 top-3 bg-white px-2.5 py-1 text-xs uppercase tracking-[.14em] text-[var(--store-primary)]">
            Nuevo
          </span>
        ) : null}
      </Link>
      <div className="pt-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row">
          <div>
            <p className="text-xs uppercase tracking-[.12em] text-[var(--store-muted)]">
              Catálogo online
            </p>
            <h3 className="mt-1 font-serif text-xl sm:text-2xl">
              <Link
                className="hover:text-[var(--store-primary)]"
                to={`/${tenantSlug}/productos/${product.slug}`}
              >
                {product.name}
              </Link>
            </h3>
          </div>
          <span
            className={cn(
              "text-xs text-[var(--store-muted)]",
              product.stock <= 0 && "text-[var(--store-primary)]",
            )}
          >
            {product.stock > 0 ? "Disponible" : "Sin stock"}
          </span>
        </div>
        <p className="mt-3 font-medium">{formatPrice(product.price)}</p>
        <Link
          className="mt-3 block border-t border-[var(--store-hairline)] pt-3 text-sm hover:text-[var(--store-primary)]"
          to={`/${tenantSlug}/productos/${product.slug}`}
        >
          Ver detalle
        </Link>
      </div>
    </article>
  );
}
