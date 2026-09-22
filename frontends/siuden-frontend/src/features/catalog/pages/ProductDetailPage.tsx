import { useCategories, useProduct, usePublicTenant } from "@/features/catalog/hooks/use-catalog";
import { getProductImageUrl } from "@/features/catalog/utils/catalog.utils";
import { AnnouncementBar } from "@/features/storefront/components/AnnouncementBar";
import { FloatingWhatsappButton } from "@/features/storefront/components/FloatingWhatsappButton";
import { Footer } from "@/features/storefront/components/Footer";
import { Header } from "@/features/storefront/components/Header";
import { getStorefrontTheme } from "@/features/storefront/utils/storefront-theme";
import { useTenantDocument } from "@/features/storefront/hooks/use-tenant-document";
import { formatPrice } from "@/lib/format";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

export function ProductDetailPage() {
  const { tenantSlug = "rubi", productSlug = "" } = useParams();
  const tenantQuery = usePublicTenant(tenantSlug);
  const categoriesQuery = useCategories(tenantSlug);
  const productQuery = useProduct(tenantSlug, productSlug);
  const product = productQuery.data;
  const tenant = tenantQuery.data;
  const tenantName = tenant?.brandName || tenant?.name || "Tienda";
  useTenantDocument(tenant);
  const [selectedVariantId, setSelectedVariantId] = useState<number>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const selectedVariant = useMemo(
    () =>
      product?.variants.find((variant) => variant.id === selectedVariantId) ??
      product?.variants[0],
    [product, selectedVariantId],
  );
  const images = product?.images ?? [];
  const primaryCategory =
    product?.categories.find((category) => category.isPrimary) ??
    product?.categories[0];

  useEffect(() => {
    if (!product) return;
    document.title = product.seoTitle || `${product.name} | ${tenantName}`;
    return () => {
      document.title = tenantName;
    };
  }, [product, tenantName]);

  useEffect(() => {
    if (!galleryOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setGalleryOpen(false);
      if (event.key === "ArrowLeft" && images.length > 1) {
        setSelectedImageIndex((current) =>
          current === 0 ? images.length - 1 : current - 1,
        );
      }
      if (event.key === "ArrowRight" && images.length > 1) {
        setSelectedImageIndex((current) => (current + 1) % images.length);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [galleryOpen, images.length]);

  const headerProducts = product && selectedVariant
    ? [{
        id: product.id,
        name: product.name,
        description: product.description,
        slug: product.slug,
        price: selectedVariant.price,
        stock: product.variants.reduce((total, variant) => total + variant.stock, 0),
        imageUrl: images.find((image) => image.isPrimary)?.url ?? images[0]?.url ?? null,
        createdAt: "",
      }]
    : [];

  return (
    <div
      className="min-h-screen overflow-x-clip bg-[var(--store-background)] font-[var(--store-body-font)] text-[var(--store-text)] [&_.font-serif]:font-[var(--store-heading-font)]"
      style={getStorefrontTheme(tenant)}
    >
      <AnnouncementBar tenant={tenant} />
      <Header
        categories={categoriesQuery.data ?? []}
        products={headerProducts}
        tenantName={tenantName}
        tenantSlug={tenantSlug}
        tenant={tenant}
      />

      <main className="mx-auto w-[min(100%-2rem,76rem)] py-8 sm:py-12 lg:py-16">
        {productQuery.isLoading ? (
          <div className="grid animate-pulse gap-10 lg:grid-cols-2">
            <div className="aspect-square bg-[var(--store-hairline)]" />
            <div className="space-y-5 pt-4">
              <div className="h-4 w-1/2 bg-[var(--store-hairline)]" />
              <div className="h-12 w-4/5 bg-[var(--store-hairline)]" />
              <div className="h-8 w-1/3 bg-[var(--store-hairline)]" />
            </div>
          </div>
        ) : productQuery.isError || !product ? (
          <section className="border border-[var(--store-hairline)] bg-white px-6 py-20 text-center">
            <h1 className="font-serif text-3xl">Producto no disponible</h1>
            <p className="mt-3 text-[var(--store-muted)]">
              Es posible que ya no esté publicado o que el enlace haya cambiado.
            </p>
            <Link
              className="mt-7 inline-block border border-[var(--store-primary)] px-6 py-3 text-sm text-[var(--store-primary)]"
              to={`/${tenantSlug}/productos`}
            >
              Volver al catálogo
            </Link>
          </section>
        ) : (
          <>
            <nav aria-label="Ruta de navegación" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[var(--store-muted)]">
              <Link to={`/${tenantSlug}`}>Inicio</Link>
              <span aria-hidden="true">/</span>
              <Link to={`/${tenantSlug}/productos`}>Productos</Link>
              {primaryCategory ? (
                <>
                  <span aria-hidden="true">/</span>
                  <Link to={`/${tenantSlug}/productos?categoria=${encodeURIComponent(primaryCategory.slug)}`}>
                    {primaryCategory.name}
                  </Link>
                </>
              ) : null}
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="text-[var(--store-text)]">{product.name}</span>
            </nav>

            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,.9fr)] lg:gap-16">
              <section className="grid gap-4 sm:grid-cols-[5.5rem_minmax(0,1fr)]">
                {images.length > 1 ? (
                  <div className="order-2 flex gap-3 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:overflow-visible sm:pb-0">
                    {images.map((image, index) => (
                      <button
                        aria-label={`Ver imagen ${index + 1} de ${product.name}`}
                        aria-pressed={selectedImageIndex === index}
                        className={`aspect-square w-20 shrink-0 overflow-hidden border-2 bg-white p-1 transition sm:w-full ${selectedImageIndex === index ? "border-[var(--store-primary)]" : "border-transparent hover:border-[var(--store-hairline)]"}`}
                        key={image.id}
                        onClick={() => setSelectedImageIndex(index)}
                        type="button"
                      >
                        <img className="size-full object-cover" src={getProductImageUrl(image.url)} alt="" />
                      </button>
                    ))}
                  </div>
                ) : null}
                <button
                  aria-label={`Ampliar imagen de ${product.name}`}
                  className="group relative order-1 aspect-square min-h-0 overflow-hidden bg-white sm:order-2"
                  onClick={() => setGalleryOpen(true)}
                  type="button"
                >
                  <img
                    className="size-full object-contain transition duration-500 group-hover:scale-[1.02]"
                    src={getProductImageUrl(images[selectedImageIndex]?.url ?? null)}
                    alt={product.name}
                  />
                  <span className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 px-3 py-2 text-xs shadow-sm backdrop-blur-sm">
                    <Maximize2 className="size-4" /> Ampliar
                  </span>
                </button>
              </section>

              <section className="lg:sticky lg:top-32">
                {primaryCategory ? (
                  <p className="text-xs font-semibold uppercase tracking-[.18em] text-[var(--store-primary)]">{primaryCategory.name}</p>
                ) : null}
                <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">{product.name}</h1>
                <p className="mt-5 text-2xl font-medium">{formatPrice(selectedVariant?.price ?? 0)}</p>

                {product.variants.length > 1 ? (
                  <fieldset className="mt-8">
                    <legend className="text-sm font-semibold">Elegí una variante</legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.variants.map((variant) => (
                        <button
                          aria-pressed={selectedVariant?.id === variant.id}
                          className={`min-h-11 border px-4 text-sm ${selectedVariant?.id === variant.id ? "border-[var(--store-primary)] bg-[var(--store-primary)] text-white" : "border-[var(--store-hairline)] bg-white"}`}
                          key={variant.id}
                          onClick={() => setSelectedVariantId(variant.id)}
                          type="button"
                        >
                          {variant.variantName || `Opción ${variant.id}`}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                ) : null}

                <p className={`mt-6 text-sm ${selectedVariant && selectedVariant.stock > 0 ? "text-[var(--store-muted)]" : "text-[var(--store-primary)]"}`}>
                  {selectedVariant && selectedVariant.stock > 0 ? "Disponible" : "Sin stock"}
                  {selectedVariant?.sku ? ` · SKU ${selectedVariant.sku}` : ""}
                </p>

                <div className="mt-8 border-t border-[var(--store-hairline)] pt-7">
                  <h2 className="text-xs font-semibold uppercase tracking-[.18em]">Descripción</h2>
                  <p className="mt-4 whitespace-pre-line leading-7 text-[var(--store-muted)]">
                    {product.description || "Consultanos para conocer más detalles sobre este producto."}
                  </p>
                </div>
              </section>
            </div>
          </>
        )}
      </main>

      <Footer categories={categoriesQuery.data ?? []} tenant={tenant} tenantName={tenantName} tenantSlug={tenantSlug} />
      <FloatingWhatsappButton tenant={tenant} />

      {galleryOpen ? (
        <div
          aria-label={`Galería ampliada de ${product?.name ?? "producto"}`}
          aria-modal="true"
          className="fixed inset-0 z-[100] grid place-items-center bg-black/85 p-4 sm:p-8"
          onClick={() => setGalleryOpen(false)}
          role="dialog"
        >
          <button
            aria-label="Cerrar galería"
            className="absolute right-4 top-4 z-10 grid size-12 place-items-center rounded-full bg-white text-black shadow-lg sm:right-8 sm:top-8"
            onClick={() => setGalleryOpen(false)}
            type="button"
          >
            <X className="size-6" />
          </button>

          {images.length > 1 ? (
            <button
              aria-label="Imagen anterior"
              className="absolute left-3 z-10 grid size-12 place-items-center rounded-full bg-white text-black shadow-lg sm:left-8"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedImageIndex((current) =>
                  current === 0 ? images.length - 1 : current - 1,
                );
              }}
              type="button"
            >
              <ChevronLeft className="size-7" />
            </button>
          ) : null}

          <div
            className="flex max-h-[90vh] max-w-[90vw] items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              className="max-h-[90vh] max-w-[90vw] object-contain"
              src={getProductImageUrl(images[selectedImageIndex]?.url ?? null)}
              alt={`${product?.name ?? "Producto"}, imagen ${selectedImageIndex + 1}`}
            />
          </div>

          {images.length > 1 ? (
            <button
              aria-label="Imagen siguiente"
              className="absolute right-3 z-10 grid size-12 place-items-center rounded-full bg-white text-black shadow-lg sm:right-8"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedImageIndex((current) => (current + 1) % images.length);
              }}
              type="button"
            >
              <ChevronRight className="size-7" />
            </button>
          ) : null}

          {images.length > 1 ? (
            <span className="absolute bottom-5 rounded-full bg-black/60 px-3 py-1.5 text-sm text-white">
              {selectedImageIndex + 1} / {images.length}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
