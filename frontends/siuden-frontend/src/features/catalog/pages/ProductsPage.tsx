import { ProductCard } from "@/features/catalog/components/ProductCard";
import {
  useCategories,
  useProducts,
  usePublicTenant,
} from "@/features/catalog/hooks/use-catalog";
import {
  productSort,
  type ProductSort,
} from "@/features/catalog/types/catalog.types";
import {
  categoryProductsHref,
  findCategoryPath,
  flattenCategories,
} from "@/features/catalog/utils/catalog.utils";
import { AnnouncementBar } from "@/features/storefront/components/AnnouncementBar";
import { Footer } from "@/features/storefront/components/Footer";
import { Header } from "@/features/storefront/components/Header";
import { storefrontTheme } from "@/features/storefront/utils/storefront-theme";
import { FloatingWhatsappButton } from "@/features/storefront/components/FloatingWhatsappButton";
import { useEffect, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

const PAGE_SIZE = 12;
const VALID_SORTS = new Set<ProductSort>(Object.values(productSort));

const getPositiveInteger = (value: string | null) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : 1;
};

const getSort = (value: string | null): ProductSort => {
  const number = Number(value) as ProductSort;
  return VALID_SORTS.has(number) ? number : productSort.newest;
};

export function ProductsPage() {
  const { tenantSlug = "rubi" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = getPositiveInteger(searchParams.get("pagina"));
  const sortBy = getSort(searchParams.get("orden"));
  const categorySlug = searchParams.get("categoria") ?? undefined;
  const tenantQuery = usePublicTenant(tenantSlug);
  const categoriesQuery = useCategories(tenantSlug);
  const flatCategories = useMemo(
    () => flattenCategories(categoriesQuery.data ?? []),
    [categoriesQuery.data],
  );
  const selectedCategory = flatCategories.find(
    (category) => category.slug === categorySlug,
  );
  const categoryPath = useMemo(
    () => findCategoryPath(categoriesQuery.data ?? [], categorySlug),
    [categoriesQuery.data, categorySlug],
  );
  const productsQuery = useProducts(tenantSlug, {
    categoryId: selectedCategory?.id,
    enabled: !categoriesQuery.isLoading,
    pageNumber: page,
    pageSize: PAGE_SIZE,
    sortBy,
  });
  const products = productsQuery.data?.items ?? [];
  const totalPages = Math.max(productsQuery.data?.totalPages ?? 1, 1);
  const tenantName = tenantQuery.data?.name ?? "Rubí";

  useEffect(() => {
    if (productsQuery.data && page > totalPages) {
      const next = new URLSearchParams(searchParams);
      next.set("pagina", String(totalPages));
      setSearchParams(next, { replace: true });
    }
  }, [page, productsQuery.data, searchParams, setSearchParams, totalPages]);

  const updateFilters = (changes: Record<string, string | undefined>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    if (!("pagina" in changes)) next.delete("pagina");
    setSearchParams(next);
    requestAnimationFrame(() =>
      document
        .getElementById("catalogo")
        ?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  const visiblePages = Array.from(
    new Set(
      [1, page - 1, page, page + 1, totalPages].filter(
        (candidate) => candidate >= 1 && candidate <= totalPages,
      ),
    ),
  ).sort((a, b) => a - b);

  return (
    <div
      className="min-h-screen overflow-x-clip bg-[var(--store-background)] font-[Georgia] text-[var(--store-text)]"
      style={storefrontTheme}
    >
      <AnnouncementBar />
      <Header
        categories={categoriesQuery.data ?? []}
        products={products}
        tenantName={tenantName}
        tenantSlug={tenantSlug}
      />

      <main
        className="mx-auto w-[min(100%-2rem,86rem)] scroll-mt-32 py-6 sm:py-8 lg:py-10"
        id="catalogo"
      >
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <nav
            aria-label="Ruta de navegación"
            className="flex shrink-0 items-center gap-2 text-sm text-[var(--store-muted)]"
          >
            <Link
              className="hover:text-[var(--store-primary)]"
              to={`/${tenantSlug}`}
            >
              Inicio
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              className="hover:text-[var(--store-primary)]"
              to={`/${tenantSlug}/productos`}
            >
              Productos
            </Link>
            {categoryPath.map((category) => (
              <span className="contents" key={category.id}>
                <span aria-hidden="true">/</span>
                {category.id === selectedCategory?.id ? (
                  <span aria-current="page" className="text-[var(--store-text)]">
                    {category.name}
                  </span>
                ) : (
                  <Link
                    className="hover:text-[var(--store-primary)]"
                    to={categoryProductsHref(tenantSlug, category)}
                  >
                    {category.name}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <header className="max-w-2xl sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[var(--store-primary)]">
              Catálogo {tenantName} - Productos
            </p>
            <p className="mt-1 text-sm leading-6 text-[var(--store-muted)]">
              Recorré el catálogo completo, filtrá por categoría y ordená las
              piezas como prefieras.
            </p>
          </header>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14">
          <aside className="border border-[var(--store-hairline)] bg-white p-6 lg:sticky lg:top-32">
            <h2 className="text-xs font-semibold uppercase tracking-[.18em]">
              Categorías
            </h2>
            {categoriesQuery.isLoading ? (
              <div className="mt-5 grid gap-3">
                {Array.from({ length: 6 }, (_, index) => (
                  <span
                    className="h-5 animate-pulse bg-[var(--store-hairline)]"
                    key={index}
                  />
                ))}
              </div>
            ) : (
              <nav className="mt-5 flex flex-col border-t border-[var(--store-hairline)]">
                <button
                  className={`border-b border-[var(--store-hairline)] py-3 text-left text-sm transition-colors hover:text-[var(--store-primary)] ${!selectedCategory ? "font-semibold text-[var(--store-primary)]" : ""}`}
                  onClick={() => updateFilters({ categoria: undefined })}
                  type="button"
                >
                  Todas
                </button>
                {flatCategories.map((category) => (
                  <button
                    aria-current={
                      selectedCategory?.id === category.id ? "true" : undefined
                    }
                    className={`border-b border-[var(--store-hairline)] py-3 text-left text-sm transition-colors hover:text-[var(--store-primary)] ${selectedCategory?.id === category.id ? "font-semibold text-[var(--store-primary)]" : ""}`}
                    key={category.id}
                    onClick={() => updateFilters({ categoria: category.slug })}
                    style={{ paddingLeft: `${category.depth * 0.8}rem` }}
                    type="button"
                  >
                    {category.depth > 0 ? "— " : ""}
                    {category.name}
                  </button>
                ))}
              </nav>
            )}
          </aside>

          <section aria-busy={productsQuery.isFetching}>
            <div className="mb-8 flex flex-col gap-4 border-y border-[var(--store-hairline)] py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--store-muted)]">
                {productsQuery.data
                  ? `${productsQuery.data.totalCount} ${productsQuery.data.totalCount === 1 ? "producto" : "productos"}`
                  : "Cargando productos…"}
                {selectedCategory ? ` en ${selectedCategory.name}` : ""}
              </p>
              <label className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-3">
                <span className="text-[var(--store-muted)]">Ordenar por</span>
                <select
                  className="min-h-11 border border-[var(--store-hairline)] bg-white px-3 outline-none focus:border-[var(--store-primary)]"
                  id="product_order"
                  name="product_order"
                  onChange={(event) =>
                    updateFilters({ orden: event.target.value })
                  }
                  value={sortBy}
                >
                  <option value={productSort.newest}>
                    Más nuevo a más viejo
                  </option>
                  <option value={productSort.oldest}>
                    Más viejo a más nuevo
                  </option>
                  <option value={productSort.priceAsc}>
                    Precio menor a mayor
                  </option>
                  <option value={productSort.priceDesc}>
                    Precio mayor a menor
                  </option>
                </select>
              </label>
            </div>

            {productsQuery.isLoading ? (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
                {Array.from({ length: 6 }, (_, index) => (
                  <div className="animate-pulse" key={index}>
                    <div className="aspect-[4/5] bg-[var(--store-hairline)]" />
                    <div className="mt-4 h-5 w-2/3 bg-[var(--store-hairline)]" />
                    <div className="mt-3 h-7 w-5/6 bg-[var(--store-hairline)]" />
                  </div>
                ))}
              </div>
            ) : productsQuery.isError ? (
              <div className="border border-[var(--store-hairline)] bg-white px-6 py-14 text-center">
                <h2 className="font-serif text-2xl">
                  No pudimos cargar el catálogo
                </h2>
                <p className="mt-2 text-sm text-[var(--store-muted)]">
                  Intentá nuevamente en unos instantes.
                </p>
                <button
                  className="mt-6 border border-[var(--store-primary)] px-5 py-3 text-sm text-[var(--store-primary)]"
                  onClick={() => void productsQuery.refetch()}
                  type="button"
                >
                  Reintentar
                </button>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 md:grid-cols-3">
                {products.map((product, index) => (
                  <ProductCard
                    index={index}
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="border border-[var(--store-hairline)] bg-white px-6 py-14 text-center">
                <h2 className="font-serif text-2xl">
                  Todavía no hay productos en esta categoría
                </h2>
                <p className="mt-2 text-sm text-[var(--store-muted)]">
                  Elegí otra categoría o volvé pronto para ver novedades.
                </p>
              </div>
            )}

            {productsQuery.data && productsQuery.data.totalCount > 0 ? (
              <nav
                aria-label="Paginación del catálogo"
                className="mt-14 flex flex-wrap items-center justify-center gap-2"
              >
                <button
                  className="min-h-12 min-w-28 border border-[var(--store-hairline)] px-4 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!productsQuery.data.hasPreviousPage}
                  onClick={() => updateFilters({ pagina: String(page - 1) })}
                  type="button"
                >
                  Anterior
                </button>
                {visiblePages.map((pageNumber, index) => (
                  <span className="contents" key={pageNumber}>
                    {index > 0 && pageNumber - visiblePages[index - 1] > 1 ? (
                      <span className="grid size-12 place-items-center">…</span>
                    ) : null}
                    <button
                      aria-current={pageNumber === page ? "page" : undefined}
                      aria-label={`Página ${pageNumber}`}
                      className={`grid size-12 place-items-center border text-sm ${pageNumber === page ? "border-[var(--store-primary)] bg-[var(--store-primary)] text-white" : "border-[var(--store-hairline)] hover:border-[var(--store-primary)]"}`}
                      onClick={() =>
                        updateFilters({ pagina: String(pageNumber) })
                      }
                      type="button"
                    >
                      {pageNumber}
                    </button>
                  </span>
                ))}
                <button
                  className="min-h-12 min-w-28 border border-[var(--store-hairline)] px-4 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!productsQuery.data.hasNextPage}
                  onClick={() => updateFilters({ pagina: String(page + 1) })}
                  type="button"
                >
                  Siguiente
                </button>
              </nav>
            ) : null}
          </section>
        </div>
      </main>

      <Footer
        categories={categoriesQuery.data ?? []}
        tenantName={tenantName}
        tenantSlug={tenantSlug}
      />
      <FloatingWhatsappButton />
    </div>
  );
}
