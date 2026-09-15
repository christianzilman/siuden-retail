import { PageHeader, QueryState } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { usePermission } from "@/features/auth/hooks/use-auth";
import { useCategoriesQuery } from "@/features/categories/hooks/use-categories";
import { FieldError } from "@/features/products/components/field-error";
import { NumberField } from "@/features/products/components/number-field";
import { SectionTitle } from "@/features/products/components/section-title";
import { VariantDimensions } from "@/features/products/components/variant-dimensions";
import { useCreateProductMutation, useProductQuery, useUpdateProductMutation } from "@/features/products/hooks/use-products";
import { useUnsavedProductWarning } from "@/features/products/hooks/use-unsaved-product-warning";
import type { CreateProductInput, ProductImageInput, ProductOptionInput, ProductVariantInput } from "@/features/products/types/contracts";
import type { ImageDraft, ProductFormValues } from "@/features/products/types/forms";
import { defaultVariant, dimensionsFromForm, draftId, IMAGE_TYPES, MAX_IMAGE_BYTES, MAX_IMAGES, nullable, PRODUCT_DEFAULTS, slugify } from "@/features/products/utils/products-helpers";
import { productFormSchema } from "@/features/products/validations/products.schema";
import { errorMessage } from "@/lib/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, ArrowLeft, ArrowUp, Boxes, Eye, ImagePlus, Images, Layers3, LoaderCircle, Package, Plus, Save, SlidersHorizontal, Sparkles, Trash2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export function ProductFormPage() {
  const { productId } = useParams<{ productId: string }>();
  const isEditing = Boolean(productId);
  const navigate = useNavigate();
  const canWrite = usePermission("products.write");
  const categories = useCategoriesQuery();
  const productQuery = useProductQuery(productId);
  const createProduct = useCreateProductMutation();
  const updateProduct = useUpdateProductMutation(productId ?? "");
  const [images, setImages] = useState<ImageDraft[]>([]);
  const [imagesDirty, setImagesDirty] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const initializedProduct = useRef<string | null>(null);
  const form = useForm<ProductFormValues>({ resolver: zodResolver(productFormSchema), defaultValues: PRODUCT_DEFAULTS, mode: "onBlur" });
  const variantsArray = useFieldArray({ control: form.control, name: "variants", keyName: "fieldKey" });
  const simpleProduct = useWatch({ control: form.control, name: "simpleProduct" });
  const options = useWatch({ control: form.control, name: "options" });
  const variants = useWatch({ control: form.control, name: "variants" });
  const categoryIds = useWatch({ control: form.control, name: "categoryIds" });
  const primaryCategoryId = useWatch({ control: form.control, name: "primaryCategoryId" });
  const name = useWatch({ control: form.control, name: "name" });

  useEffect(() => {
    const product = productQuery.data;
    if (!isEditing || !product || initializedProduct.current === product.id) return;
    initializedProduct.current = product.id;
    form.reset({
      name: product.name,
      slug: product.slug,
      description: product.description ?? "",
      seoTitle: product.seoTitle ?? "",
      seoDescription: product.seoDescription ?? "",
      sellingMode: product.sellingMode,
      status: product.status,
      simpleProduct: product.options.length === 0,
      categoryIds: product.categoryAssignments.map((assignment) => assignment.categoryId),
      primaryCategoryId: product.categoryAssignments.find((assignment) => assignment.isPrimary)?.categoryId ?? "",
      options: product.options.map((option) => ({
        id: option.id,
        name: option.name,
        sortOrder: option.sortOrder,
        values: option.values.map((value) => ({ id: value.id, value: value.value, sortOrder: value.sortOrder })),
      })),
      variants: product.variants.map((variant) => ({
        id: variant.id,
        name: variant.name,
        sku: variant.sku ?? "",
        barcode: variant.barcode ?? "",
        price: variant.price,
        compareAtPrice: variant.compareAtPrice,
        cost: variant.cost,
        selectedOptionValueIds: variant.selectedOptionValueIds,
        trackInventory: variant.trackInventory,
        allowBackorder: variant.allowBackorder,
        isDefault: variant.isDefault,
        enabled: variant.enabled,
        sortOrder: variant.sortOrder,
        initialStock: null,
        lowStockThreshold: null,
        weightKg: variant.dimensions.weightKg ?? null,
        heightCm: variant.dimensions.heightCm ?? null,
        widthCm: variant.dimensions.widthCm ?? null,
        depthCm: variant.dimensions.depthCm ?? null,
      })),
    });
    setImages(product.images.map((image) => ({
      id: image.id,
      productVariantId: image.productVariantId,
      mediaAssetId: image.mediaAssetId,
      url: image.url,
      altText: image.altText ?? "",
      sortOrder: image.sortOrder,
      isPrimary: image.isPrimary,
    })));
    setImagesDirty(false);
  }, [form, isEditing, productQuery.data]);

  const hasUnsavedChanges = form.formState.isDirty || imagesDirty;
  useUnsavedProductWarning(hasUnsavedChanges && !createProduct.isPending && !updateProduct.isPending);

  const setOptions = (next: ProductFormValues["options"]) => {
    form.setValue("options", next, { shouldDirty: true, shouldValidate: true });
  };

  const toggleSimple = (checked: boolean) => {
    form.setValue("simpleProduct", checked, { shouldDirty: true, shouldValidate: false });
    if (checked) {
      form.setValue("options", [], { shouldDirty: true, shouldValidate: false });
      const first = form.getValues("variants.0") ?? defaultVariant();
      variantsArray.replace([{ ...first, id: first.id || draftId(), name: first.name || "Default", selectedOptionValueIds: [], isDefault: true, sortOrder: 0 }]);
    } else if (form.getValues("options").length === 0) {
      form.setValue("options", [{ id: draftId(), name: "Material", sortOrder: 0, values: [{ id: draftId(), value: "", sortOrder: 0 }] }], { shouldDirty: true, shouldValidate: false });
    }
  };

  const generateVariants = () => {
    const currentOptions = form.getValues("options");
    if (currentOptions.length === 0 || currentOptions.some((option) => option.values.length === 0 || option.values.some((value) => !value.value.trim()))) {
      toast.error("Completá las opciones y sus valores antes de generar combinaciones.");
      return;
    }
    const combinations = currentOptions.reduce<string[][]>(
      (accumulator, option) => accumulator.flatMap((combination) => option.values.map((value) => [...combination, value.id])),
      [[]],
    );
    const existing = new Map(form.getValues("variants").map((variant) => [[...variant.selectedOptionValueIds].sort().join("|"), variant] as const));
    const valueLabels = new Map(currentOptions.flatMap((option) => option.values.map((value) => [value.id, value.value] as const)));
    variantsArray.replace(combinations.map((combination, index) => {
      const key = [...combination].sort().join("|");
      const previous = existing.get(key);
      return previous ?? {
        ...defaultVariant(),
        id: draftId(),
        name: combination.map((id) => valueLabels.get(id)).filter(Boolean).join(" / "),
        selectedOptionValueIds: combination,
        isDefault: index === 0,
        initialStock: 0,
        sortOrder: index,
      };
    }));
    void form.trigger("variants");
  };

  const selectImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = [...(event.target.files ?? [])];
    event.target.value = "";
    const remaining = MAX_IMAGES - images.length;
    if (files.length > remaining) {
      setImageError(`Podés cargar hasta ${MAX_IMAGES} imágenes. Quedan ${remaining} lugares.`);
      return;
    }
    const invalid = files.find((file) => !IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_BYTES);
    if (invalid) {
      setImageError(`${invalid.name}: usá JPG, PNG o WebP de hasta 10 MB.`);
      return;
    }
    setImageError(null);
    setImages((current) => [
      ...current,
      ...files.map((file, index): ImageDraft => ({
        url: URL.createObjectURL(file),
        altText: "",
        productVariantId: null,
        sortOrder: current.length + index,
        isPrimary: current.length === 0 && index === 0,
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      })),
    ]);
    setImagesDirty(true);
  };

  const updateImage = (index: number, patch: Partial<ImageDraft>) => {
    setImages((current) => current.map((image, imageIndex) => imageIndex === index ? { ...image, ...patch } : image));
    setImagesDirty(true);
  };

  const makePrimary = (index: number) => {
    setImages((current) => current.map((image, imageIndex) => ({ ...image, isPrimary: imageIndex === index })));
    setImagesDirty(true);
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    setImages((current) => {
      const next = [...current];
      const first = next[index];
      const second = next[target];
      if (!first || !second) return current;
      next[index] = second;
      next[target] = first;
      return next.map((image, sortOrder) => ({ ...image, sortOrder }));
    });
    setImagesDirty(true);
  };

  const removeImage = (index: number) => {
    setImages((current) => {
      const removed = current[index];
      if (removed?.url.startsWith("blob:")) URL.revokeObjectURL(removed.url);
      const next = current.filter((_, imageIndex) => imageIndex !== index);
      if (removed?.isPrimary && next[0]) next[0] = { ...next[0], isPrimary: true };
      return next.map((image, sortOrder) => ({ ...image, sortOrder }));
    });
    setImagesDirty(true);
  };

  const submit = form.handleSubmit(async (values) => {
    const categoryAssignments = values.categoryIds.map((categoryId, sortOrder) => ({
      categoryId,
      isPrimary: categoryId === values.primaryCategoryId,
      sortOrder,
    }));
    const optionInput: ProductOptionInput[] = values.simpleProduct ? [] : values.options;
    const variantInput: ProductVariantInput[] = values.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      sku: nullable(variant.sku),
      barcode: nullable(variant.barcode),
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      cost: variant.cost,
      selectedOptionValueIds: values.simpleProduct ? [] : variant.selectedOptionValueIds,
      dimensions: dimensionsFromForm(variant),
      trackInventory: variant.trackInventory,
      allowBackorder: variant.allowBackorder,
      isDefault: values.simpleProduct ? true : variant.isDefault,
      enabled: variant.enabled,
      sortOrder: variant.sortOrder,
    }));
    const imageInput: ProductImageInput[] = images.map((image, sortOrder) => ({
      id: image.id,
      productVariantId: image.productVariantId,
      mediaAssetId: image.mediaAssetId,
      url: image.url,
      altText: nullable(image.altText),
      sortOrder,
      isPrimary: image.isPrimary,
      originalName: image.originalName,
      mimeType: image.mimeType,
      sizeBytes: image.sizeBytes,
    }));
    const core = {
      name: values.name,
      slug: values.slug,
      description: nullable(values.description),
      status: values.status,
      sellingMode: values.sellingMode,
      seoTitle: nullable(values.seoTitle),
      seoDescription: nullable(values.seoDescription),
      categoryAssignments,
      options: optionInput,
      images: imageInput,
      variants: variantInput,
    } satisfies Omit<CreateProductInput, "initialInventory">;
    try {
      if (isEditing && productId) {
        await updateProduct.mutateAsync(core);
        form.reset(values);
        setImagesDirty(false);
      } else {
        const created = await createProduct.mutateAsync({
          ...core,
          initialInventory: values.variants.flatMap((variant, variantIndex) =>
            variant.trackInventory && (variant.initialStock !== null || variant.lowStockThreshold !== null)
              ? [{
                variantId: variant.id,
                variantIndex,
                onHand: variant.initialStock ?? 0,
                lowStockThreshold: variant.lowStockThreshold,
              }]
              : [],
          ),
        });
        form.reset(values);
        setImagesDirty(false);
        navigate(`/products/${created.product.id}/edit`, { replace: true });
      }
    } catch {
      // Hooks report the service error and the form intentionally keeps its draft.
    }
  });

  const saving = createProduct.isPending || updateProduct.isPending;
  const mutationError = createProduct.error ?? updateProduct.error;
  const isLoading = categories.isPending || (isEditing && productQuery.isPending);
  const isError = categories.isError || (isEditing && productQuery.isError);

  return (
    <div className="page-shell pb-28">
      <PageHeader
        title={isEditing ? "Editar producto" : "Nuevo producto"}
        description="Separá catálogo, variantes e inventario para mantener una operación consistente."
        breadcrumbs={[{ label: "Productos", href: "/products" }, { label: isEditing ? "Editar" : "Nuevo" }]}
        actions={<Button variant="outline" asChild><Link to="/products"><ArrowLeft />Volver</Link></Button>}
      />
      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={categories.error ?? productQuery.error}
        onRetry={() => void Promise.all([categories.refetch(), ...(isEditing ? [productQuery.refetch()] : [])])}
      >
        <form className="space-y-6" onSubmit={submit} noValidate>
          <Card>
            <CardHeader><SectionTitle icon={Package} title="Información general" description="Nombre, URL y descripción pública del producto." /></CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Nombre</Label>
                  <Input
                    id="product-name"
                    autoFocus
                    aria-invalid={Boolean(form.formState.errors.name)}
                    {...form.register("name", {
                      onBlur: () => {
                        if (!form.getValues("slug")) form.setValue("slug", slugify(form.getValues("name")), { shouldDirty: true, shouldValidate: true });
                      },
                    })}
                  />
                  <FieldError message={form.formState.errors.name?.message} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3"><Label htmlFor="product-slug">Slug</Label><button type="button" className="text-xs font-medium text-primary hover:underline" onClick={() => form.setValue("slug", slugify(name), { shouldDirty: true, shouldValidate: true })}>Generar desde el nombre</button></div>
                  <Input id="product-slug" aria-invalid={Boolean(form.formState.errors.slug)} {...form.register("slug")} />
                  <FieldError message={form.formState.errors.slug?.message} />
                </div>
              </div>
              <div className="space-y-2"><Label htmlFor="description">Descripción</Label><Textarea id="description" rows={6} placeholder="Material, terminación, cuidados y detalles…" {...form.register("description")} /></div>
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="seo-title">Título SEO</Label><Input id="seo-title" {...form.register("seoTitle")} /><FieldError message={form.formState.errors.seoTitle?.message} /></div>
                <div className="space-y-2"><Label htmlFor="seo-description">Descripción SEO</Label><Input id="seo-description" {...form.register("seoDescription")} /><FieldError message={form.formState.errors.seoDescription?.message} /></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><SectionTitle icon={Layers3} title="Categorías" description="Elegí una categoría principal y las asociaciones secundarias." /></CardHeader>
            <CardContent>
              <div className="grid max-h-80 gap-2 overflow-y-auto rounded-lg border p-3 sm:grid-cols-2 lg:grid-cols-3">
                {categories.data?.map((category) => {
                  const selected = categoryIds.includes(category.id);
                  return (
                    <div key={category.id} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/50">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selected}
                        onChange={(event) => {
                          const next = event.target.checked ? [...categoryIds, category.id] : categoryIds.filter((id) => id !== category.id);
                          form.setValue("categoryIds", next, { shouldDirty: true, shouldValidate: true });
                          if (!event.target.checked && primaryCategoryId === category.id) form.setValue("primaryCategoryId", next[0] ?? "", { shouldDirty: true, shouldValidate: true });
                          if (event.target.checked && !primaryCategoryId) form.setValue("primaryCategoryId", category.id, { shouldDirty: true, shouldValidate: true });
                        }}
                      />
                      <Label htmlFor={`category-${category.id}`} className="min-w-0 flex-1 truncate">{category.name}</Label>
                      {selected ? (
                        <label className="flex items-center gap-1 text-xs text-muted-foreground">
                          <input type="radio" name="primary-category" checked={primaryCategoryId === category.id} onChange={() => form.setValue("primaryCategoryId", category.id, { shouldDirty: true, shouldValidate: true })} /> Principal
                        </label>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              <FieldError message={form.formState.errors.categoryIds?.message ?? form.formState.errors.primaryCategoryId?.message} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
              <SectionTitle icon={Images} title="Imágenes" description={`JPG, PNG o WebP, hasta ${MAX_IMAGES} imágenes de 10 MB.`} />
              <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border bg-background px-3 text-sm font-semibold shadow-sm hover:bg-accent">
                <Upload className="size-4" /> Cargar
                <input type="file" className="sr-only" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" multiple onChange={selectImages} />
              </label>
            </CardHeader>
            <CardContent className="space-y-4">
              {imageError ? <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">{imageError}</p> : null}
              {images.length === 0 ? (
                <div className="grid min-h-40 place-items-center rounded-lg border border-dashed bg-muted/20 text-center"><div><ImagePlus className="mx-auto size-7 text-muted-foreground" /><p className="mt-2 text-sm font-medium">Todavía no cargaste imágenes</p><p className="mt-1 text-xs text-muted-foreground">La primera imagen será la principal.</p></div></div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {images.map((image, index) => (
                    <div key={image.id ?? image.url} className="overflow-hidden rounded-lg border bg-card">
                      <div className="relative aspect-[4/3] bg-muted"><img src={image.url} alt={image.altText} className="size-full object-cover" />{image.isPrimary ? <Badge className="absolute left-2 top-2">Principal</Badge> : null}</div>
                      <div className="space-y-3 p-3">
                        <div className="space-y-1.5"><Label htmlFor={`image-alt-${index}`}>Texto alternativo</Label><Input id={`image-alt-${index}`} value={image.altText} onChange={(event) => updateImage(index, { altText: event.target.value })} placeholder="Describí la imagen" /></div>
                        {!simpleProduct && variants.length > 0 ? (
                          <Select value={image.productVariantId ?? ""} onChange={(event) => updateImage(index, { productVariantId: event.target.value || null })} aria-label="Variante de la imagen"><option value="">Todo el producto</option>{variants.map((variant) => <option key={variant.id} value={variant.id}>{variant.name}</option>)}</Select>
                        ) : null}
                        <div className="flex flex-wrap gap-1.5">
                          <Button type="button" size="sm" variant="outline" disabled={image.isPrimary} onClick={() => makePrimary(index)}>Principal</Button>
                          <Button type="button" size="icon-sm" variant="ghost" aria-label="Mover imagen arriba" disabled={index === 0} onClick={() => moveImage(index, -1)}><ArrowUp /></Button>
                          <Button type="button" size="icon-sm" variant="ghost" aria-label="Mover imagen abajo" disabled={index === images.length - 1} onClick={() => moveImage(index, 1)}><ArrowDown /></Button>
                          <Button type="button" size="icon-sm" variant="ghost" className="ml-auto text-destructive" aria-label="Eliminar imagen" onClick={() => removeImage(index)}><Trash2 /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <SectionTitle icon={Sparkles} title="Variantes y precios" description="Usá un producto simple o generá combinaciones a partir de opciones." />
                <div className="flex items-center gap-2"><Switch id="simple-product" checked={simpleProduct} onCheckedChange={toggleSimple} /><Label htmlFor="simple-product">Producto simple</Label></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {!simpleProduct ? (
                <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">Opciones</p><p className="text-xs text-muted-foreground">Ej.: material, talle o color.</p></div><Button type="button" size="sm" variant="outline" onClick={() => setOptions([...options, { id: draftId(), name: "", sortOrder: options.length, values: [{ id: draftId(), value: "", sortOrder: 0 }] }])}><Plus />Agregar opción</Button></div>
                  {options.map((option, optionIndex) => (
                    <div key={option.id} className="rounded-lg border bg-card p-4">
                      <div className="flex gap-2"><Input value={option.name} placeholder="Nombre de la opción" aria-label={`Nombre de opción ${optionIndex + 1}`} onChange={(event) => setOptions(options.map((item, index) => index === optionIndex ? { ...item, name: event.target.value } : item))} /><Button type="button" variant="ghost" size="icon" className="text-destructive" aria-label="Eliminar opción" onClick={() => setOptions(options.filter((_, index) => index !== optionIndex).map((item, index) => ({ ...item, sortOrder: index })))}><Trash2 /></Button></div>
                      <div className="mt-3 flex flex-wrap gap-2">{option.values.map((value, valueIndex) => <div key={value.id} className="flex items-center rounded-md border bg-background"><Input className="w-32 border-0 shadow-none" value={value.value} aria-label={`Valor ${valueIndex + 1} de ${option.name || "opción"}`} onChange={(event) => setOptions(options.map((item, index) => index === optionIndex ? { ...item, values: item.values.map((candidate, indexValue) => indexValue === valueIndex ? { ...candidate, value: event.target.value } : candidate) } : item))} /><button type="button" className="p-2 text-muted-foreground hover:text-destructive" aria-label="Eliminar valor" onClick={() => setOptions(options.map((item, index) => index === optionIndex ? { ...item, values: item.values.filter((_, indexValue) => indexValue !== valueIndex).map((candidate, nextIndex) => ({ ...candidate, sortOrder: nextIndex })) } : item))}><X className="size-3.5" /></button></div>)}<Button type="button" variant="ghost" size="sm" onClick={() => setOptions(options.map((item, index) => index === optionIndex ? { ...item, values: [...item.values, { id: draftId(), value: "", sortOrder: item.values.length }] } : item))}><Plus />Valor</Button></div>
                    </div>
                  ))}
                  <FieldError message={form.formState.errors.options?.message} />
                  <Button type="button" onClick={generateVariants}><Sparkles />Generar combinaciones</Button>
                </div>
              ) : null}

              <div className="space-y-4">
                {variantsArray.fields.map((field, index) => {
                  const variant = variants[index];
                  const variantError = form.formState.errors.variants?.[index];
                  return (
                    <div key={field.fieldKey} className="rounded-lg border p-4">
                      <div className="mb-4 flex items-center justify-between gap-3"><div><p className="font-semibold">{variant?.name || `Variante ${index + 1}`}</p>{!simpleProduct ? <p className="text-xs text-muted-foreground">{variant?.selectedOptionValueIds.map((id) => options.flatMap((option) => option.values).find((value) => value.id === id)?.value).filter(Boolean).join(" · ")}</p> : null}</div>{!simpleProduct && variantsArray.fields.length > 1 ? <Button type="button" variant="ghost" size="icon-sm" className="text-destructive" aria-label="Eliminar variante" onClick={() => variantsArray.remove(index)}><Trash2 /></Button> : null}</div>
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="space-y-2"><Label htmlFor={`variant-name-${index}`}>Nombre</Label><Input id={`variant-name-${index}`} {...form.register(`variants.${index}.name`)} /><FieldError message={variantError?.name?.message} /></div>
                        <div className="space-y-2"><Label htmlFor={`variant-sku-${index}`}>SKU</Label><Input id={`variant-sku-${index}`} {...form.register(`variants.${index}.sku`)} /><FieldError message={variantError?.sku?.message} /></div>
                        <div className="space-y-2"><Label htmlFor={`variant-barcode-${index}`}>Código de barras</Label><Input id={`variant-barcode-${index}`} {...form.register(`variants.${index}.barcode`)} /></div>
                        <NumberField id={`variant-price-${index}`} label="Precio" name={`variants.${index}.price`} register={form.register} error={variantError?.price?.message} />
                        <NumberField id={`variant-compare-${index}`} label="Precio anterior" name={`variants.${index}.compareAtPrice`} register={form.register} error={variantError?.compareAtPrice?.message} />
                        <NumberField id={`variant-cost-${index}`} label="Costo" name={`variants.${index}.cost`} register={form.register} />
                        <div className="flex flex-wrap items-center gap-4 pt-7 md:col-span-2">
                          <label className="flex items-center gap-2 text-sm"><Checkbox {...form.register(`variants.${index}.enabled`)} />Habilitada</label>
                          <label className="flex items-center gap-2 text-sm"><Checkbox {...form.register(`variants.${index}.trackInventory`)} />Controlar stock</label>
                          <label className="flex items-center gap-2 text-sm"><Checkbox {...form.register(`variants.${index}.allowBackorder`)} />Permitir reserva futura</label>
                        </div>
                      </div>
                      <FieldError message={variantError?.selectedOptionValueIds?.message} />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><SectionTitle icon={Boxes} title="Inventario" description={isEditing ? "El saldo se modifica mediante movimientos trazables." : "La carga inicial crea saldos y un único movimiento INITIAL."} /></CardHeader>
            <CardContent className="space-y-4">
              {variantsArray.fields.map((field, index) => (
                <div key={field.fieldKey} className="grid gap-4 rounded-lg border p-4 sm:grid-cols-[minmax(160px,1fr)_180px_180px_auto] sm:items-end">
                  <div><p className="text-sm font-semibold">{variants[index]?.name || `Variante ${index + 1}`}</p><p className="text-xs text-muted-foreground">{variants[index]?.sku || "Sin SKU"}</p></div>
                  {isEditing ? <div className="sm:col-span-2"><p className="text-sm text-muted-foreground">Consultá el saldo físico, reservado y disponible en Inventario.</p></div> : <><NumberField id={`initial-stock-${index}`} label="Stock inicial" name={`variants.${index}.initialStock`} register={form.register} step="0.001" /><NumberField id={`threshold-${index}`} label="Umbral bajo" name={`variants.${index}.lowStockThreshold`} register={form.register} step="0.001" /></>}
                  <Button variant="outline" asChild><Link to={`/inventory?variant=${field.id}`}><SlidersHorizontal />{isEditing ? "Ajustar" : "Ver inventario"}</Link></Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><SectionTitle icon={Boxes} title="Dimensiones" description="Peso y medidas pertenecen a cada variante." /></CardHeader>
            <CardContent className="space-y-4">{variantsArray.fields.map((field, index) => <VariantDimensions key={field.fieldKey} control={form.control} register={form.register} index={index} name={variants[index]?.name ?? ""} />)}</CardContent>
          </Card>

          <Card>
            <CardHeader><SectionTitle icon={Eye} title="Publicación" description="Definí cómo se vende y si está visible en la tienda." /></CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="selling-mode">Modo de venta</Label><Select id="selling-mode" {...form.register("sellingMode")}><option value="DIRECT">Venta directa</option><option value="INQUIRY_ONLY">Consultar precio</option></Select></div>
              <div className="space-y-2"><Label htmlFor="product-status">Estado</Label><Select id="product-status" {...form.register("status")}><option value="DRAFT">Borrador</option><option value="PUBLISHED">Publicado</option><option value="ARCHIVED">Archivado</option></Select></div>
            </CardContent>
          </Card>

          {mutationError ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900" role="alert"><p className="font-semibold">No pudimos guardar el producto</p><p className="mt-1">{errorMessage(mutationError)}</p><p className="mt-1 text-xs text-red-700">Si el problema es un SKU, recordá que debe ser único en todo el comercio.</p></div> : null}

          <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 px-4 py-3 shadow-[0_-8px_28px_rgba(15,23,42,.08)] backdrop-blur md:left-64">
            <div className="mx-auto flex max-w-[1536px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">{hasUnsavedChanges ? "Tenés cambios sin guardar." : "Todos los cambios están guardados."}</p>
              <div className="flex gap-2"><Button type="button" variant="outline" asChild><Link to="/products">Cancelar</Link></Button><Button type="submit" disabled={!canWrite || saving || (!hasUnsavedChanges && isEditing)}>{saving ? <LoaderCircle className="animate-spin" /> : <Save />}{saving ? "Guardando…" : isEditing ? "Guardar cambios" : "Crear producto"}</Button></div>
            </div>
          </div>
        </form>
      </QueryState>
    </div>
  );
}
