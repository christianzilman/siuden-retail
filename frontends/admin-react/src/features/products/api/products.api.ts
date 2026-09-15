import type { BulkPriceAdjustmentInput, BulkPriceAdjustmentResult, CreateProductInput, ProductFilters, ProductService, UpdateProductInput } from "@/features/products/types/contracts";
import type { Product } from "@/features/products/types/products";
import { type HttpRequest } from "@/services/http-services";
import { page, params, type ApiPage } from "@/services/http-utils";

export function createProductsApi(request: HttpRequest): ProductService {
  function productPayload(input: CreateProductInput | UpdateProductInput) {
    return {
      name: input.name,
      slug: input.slug,
      description: input.description,
      status: input.status,
      sellingMode: input.sellingMode,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      categoryIds: [...input.categoryAssignments]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((item) => item.categoryId),
      options: input.options ?? [],
      variants: input.variants.map((variant) => ({
        id: variant.id,
        name: variant.name,
        sku: variant.sku ?? undefined,
        barcode: variant.barcode ?? undefined,
        price: variant.price ?? undefined,
        compareAtPrice: variant.compareAtPrice ?? undefined,
        cost: variant.cost ?? undefined,
        selectedOptionValueIds: variant.selectedOptionValueIds,
        ...variant.dimensions,
        trackInventory: variant.trackInventory,
        allowBackorder: variant.allowBackorder,
        isDefault: variant.isDefault,
        enabled: variant.enabled,
        sortOrder: variant.sortOrder,
      })),
    };
  }

  async function syncImages(
    productId: string,
    previous: Product["images"],
    next: NonNullable<CreateProductInput["images"]>,
  ) {
    const retained = new Set(
      next.flatMap((image) => (image.id ? [image.id] : [])),
    );
    await Promise.all(
      previous
        .filter((image) => !retained.has(image.id))
        .map((image) =>
          request(`/product-images/${image.id}`, { method: "DELETE" }),
        ),
    );
    for (const image of next.filter((item) => !item.id))
      await request(`/products/${productId}/images`, {
        method: "POST",
        body: JSON.stringify({
          storageKey: image.url.startsWith("/")
            ? image.url.slice(1)
            : `uploads/${image.originalName ?? crypto.randomUUID()}`,
          originalName: image.originalName ?? "imagen",
          mimeType: image.mimeType ?? "image/webp",
          sizeBytes: image.sizeBytes ?? 0,
          width: image.width ?? undefined,
          height: image.height ?? undefined,
          altText: image.altText ?? undefined,
          productVariantId: image.productVariantId ?? undefined,
          sortOrder: image.sortOrder,
          isPrimary: image.isPrimary,
        }),
      });
  }

  async function previewPrice(
    input: BulkPriceAdjustmentInput,
  ): Promise<BulkPriceAdjustmentResult> {
    const listed = page(
      await request<ApiPage<Product>>(
        `/products${params({ page: 1, limit: 100, categoryId: input.filters?.categoryId })}`,
      ),
    );
    const selected = listed.items.filter(
      (product) =>
        !input.filters?.productIds?.length ||
        input.filters.productIds.includes(product.id),
    );
    const preview = selected.flatMap((product) =>
      product.variants.map((variant) => ({
        productId: product.id,
        productName: product.name,
        variantId: variant.id,
        variantName: variant.name,
        previousPrice: variant.price,
        nextPrice:
          input.adjustPrice === false || variant.price === null
            ? variant.price
            : Math.round(variant.price * (1 + input.percentage / 100) * 100) /
            100,
        previousCompareAtPrice: variant.compareAtPrice,
        nextCompareAtPrice:
          !input.adjustCompareAtPrice || variant.compareAtPrice === null
            ? variant.compareAtPrice
            : Math.round(
              variant.compareAtPrice * (1 + input.percentage / 100) * 100,
            ) / 100,
      })),
    );
    return {
      affectedProducts: selected.length,
      affectedVariants: preview.length,
      preview,
    };
  }
  return {
    async list(filters: ProductFilters = {}) {
      return page(
        await request<ApiPage<Product>>(
          `/products${params({ page: filters.page ?? 1, limit: filters.pageSize ?? 20, search: filters.search, categoryId: filters.categoryId, status: filters.status })}`,
        ),
      );
    },
    get: (id) => request(`/products/${id}`),
    async create(input) {
      let product = await request<Product>("/products", {
        method: "POST",
        body: JSON.stringify(productPayload(input)),
      });
      await syncImages(product.id, [], input.images ?? []);
      let initialMovement = null;
      const location = (
        await request<Array<{ id: string; isDefault: boolean }>>(
          "/inventory/locations",
        )
      ).find((item) => item.isDefault);
      const items = (input.initialInventory ?? []).flatMap((item) => {
        const variant = item.variantId
          ? product.variants.find((value) => value.id === item.variantId)
          : product.variants[item.variantIndex ?? -1];
        return variant &&
          (item.onHand !== 0 || item.lowStockThreshold !== null)
          ? [
            {
              productVariantId: variant.id,
              quantityDelta: item.onHand,
              lowStockThreshold: item.lowStockThreshold ?? undefined,
            },
          ]
          : [];
      });
      if (items.length && location) {
        const result = await request<{ movement: null }>(
          "/inventory/movements",
          {
            method: "POST",
            body: JSON.stringify({
              stockLocationId: location.id,
              movementType: "INITIAL",
              reason: "Stock inicial del producto",
              items,
            }),
          },
        );
        initialMovement = result.movement;
      }
      product = await request(`/products/${product.id}`);
      return { product, initialMovement };
    },
    async update(id, input) {
      const previous = await request<Product>(`/products/${id}`);
      await request(`/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(productPayload(input)),
      });
      await syncImages(id, previous.images, input.images ?? []);
      return request(`/products/${id}`);
    },
    async duplicate(id) {
      const source = await request<Product>(`/products/${id}`);
      const stamp = Date.now();
      const valueIds = new Map<string, string>();
      const options = source.options.map((option) => ({
        ...option,
        id: crypto.randomUUID(),
        values: option.values.map((value) => {
          const nextId = crypto.randomUUID();
          valueIds.set(value.id, nextId);
          return { ...value, id: nextId };
        }),
      }));
      return request("/products", {
        method: "POST",
        body: JSON.stringify(
          productPayload({
            ...source,
            name: `${source.name} (copia)`,
            slug: `${source.slug}-copia-${stamp}`,
            status: "DRAFT",
            options,
            variants: source.variants.map((variant) => ({
              ...variant,
              id: undefined,
              sku: variant.sku ? `${variant.sku}-COPY-${stamp}` : null,
              selectedOptionValueIds: variant.selectedOptionValueIds.map(
                (valueId) => valueIds.get(valueId) ?? valueId,
              ),
            })),
          }),
        ),
      });
    },
    setStatus: (id, status) =>
      request(`/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    archive: (id) =>
      request(`/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "ARCHIVED" }),
      }),
    async delete(id) {
      await request(`/products/${id}`, { method: "DELETE" });
    },
    previewPriceAdjustment: previewPrice,
    async bulkPrice(input) {
      const result = await previewPrice(input);
      await Promise.all(
        result.preview.map((item) =>
          request(`/product-variants/${item.variantId}`, {
            method: "PATCH",
            body: JSON.stringify({
              price: item.nextPrice ?? undefined,
              compareAtPrice: item.nextCompareAtPrice ?? undefined,
            }),
          }),
        ),
      );
      return result;
    },
    async bulkPriceAdjustment(input) {
      return this.bulkPrice(input);
    },
  };
}
