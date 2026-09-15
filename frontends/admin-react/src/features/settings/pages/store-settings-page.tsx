import { PageHeader, QueryState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RUBI_BRAND_CONTENT } from "@/content/rubi";
import { useSessionQuery } from "@/features/auth/hooks/use-auth";
import { ColorField } from "@/features/settings/components/color-field";
import { FieldMessage } from "@/features/settings/components/field-message";
import { IdentityPreview } from "@/features/settings/components/identity-preview";
import { MutationErrorNotice } from "@/features/settings/components/mutation-error-notice";
import { SectionHeading } from "@/features/settings/components/section-heading";
import { SwitchRow } from "@/features/settings/components/switch-row";
import { useStoreMutations, useStoreQueries } from "@/features/settings/hooks/use-settings";
import { useUnsavedChangesWarning } from "@/features/settings/hooks/use-unsaved-changes-warning";
import type { StoreSettingsValues } from "@/features/settings/types/forms";
import { DEFAULT_STORE_VALUES, nullable } from "@/features/settings/utils/settings-helpers";
import { storeSettingsSchema } from "@/features/settings/validations/settings.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, Globe2, LoaderCircle, Megaphone, Palette, Save, Store } from "lucide-react";
import { useEffect, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

export function StoreSettingsPage() {
  const session = useSessionQuery();
  const store = useStoreQueries();
  const mutations = useStoreMutations();
  const initializedTenant = useRef<string | null>(null);
  const form = useForm<StoreSettingsValues>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: DEFAULT_STORE_VALUES,
  });

  const tenantId = session.data?.tenant.id ?? "";
  const ready = Boolean(store.profile.data && store.settings.data && store.theme.data);

  useEffect(() => {
    if (!ready || !store.profile.data || !store.settings.data || !store.theme.data) return;
    if (initializedTenant.current === tenantId) return;

    const profile = store.profile.data;
    const settings = store.settings.data;
    const theme = store.theme.data;
    form.reset({
      brandName: profile.brandName,
      contactEmail: profile.contactEmail ?? "",
      phone: profile.phone ?? "",
      addressLine: profile.addressLine ?? "",
      addressNumber: profile.addressNumber ?? "",
      city: profile.city ?? "",
      province: profile.province ?? "",
      postalCode: profile.postalCode ?? "",
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      backgroundColor: theme.backgroundColor,
      textColor: theme.textColor,
      headingFont: theme.headingFont,
      bodyFont: theme.bodyFont,
      borderRadius: theme.borderRadius,
      announcementEnabled: theme.announcementEnabled,
      announcementText: theme.announcementText ?? "",
      announcementUrl: theme.announcementUrl ?? "",
      isPublished: settings.isPublished,
      showPrices: settings.showPrices,
      defaultCatalogSort: settings.defaultCatalogSort,
      catalogColumnsDesktop: settings.catalogColumnsDesktop,
    });
    initializedTenant.current = tenantId;
  }, [form, ready, store.profile.data, store.settings.data, store.theme.data, tenantId]);

  useUnsavedChangesWarning(form.formState.isDirty);

  const previewValues = useWatch({ control: form.control }) as StoreSettingsValues;
  const saving = mutations.profile.isPending || mutations.settings.isPending || mutations.theme.isPending;
  const saveError = mutations.profile.error ?? mutations.settings.error ?? mutations.theme.error;
  const publicUrl = RUBI_BRAND_CONTENT.storefrontSettings.publicUrl;

  const submit = form.handleSubmit(async (values) => {
    if (!store.profile.data || !store.settings.data || !store.theme.data) return;

    const normalizedValues: StoreSettingsValues = {
      ...values,
      brandName: values.brandName.trim(),
      contactEmail: values.contactEmail.trim(),
      phone: values.phone.trim(),
      addressLine: values.addressLine.trim(),
      addressNumber: values.addressNumber.trim(),
      city: values.city.trim(),
      province: values.province.trim(),
      postalCode: values.postalCode.trim(),
      announcementText: values.announcementText.trim(),
      announcementUrl: values.announcementUrl.trim(),
    };

    try {
      await Promise.all([
        mutations.profile.mutateAsync({
          brandName: normalizedValues.brandName,
          contactEmail: nullable(normalizedValues.contactEmail),
          phone: nullable(normalizedValues.phone),
          addressLine: nullable(normalizedValues.addressLine),
          addressNumber: nullable(normalizedValues.addressNumber),
          city: nullable(normalizedValues.city),
          province: nullable(normalizedValues.province),
          postalCode: nullable(normalizedValues.postalCode),
          countryCode: store.profile.data.countryCode,
        }),
        mutations.theme.mutateAsync({
          logoAssetId: store.theme.data.logoAssetId,
          faviconAssetId: store.theme.data.faviconAssetId,
          primaryColor: normalizedValues.primaryColor,
          secondaryColor: normalizedValues.secondaryColor,
          backgroundColor: normalizedValues.backgroundColor,
          textColor: normalizedValues.textColor,
          headingFont: normalizedValues.headingFont,
          bodyFont: normalizedValues.bodyFont,
          borderRadius: normalizedValues.borderRadius,
          announcementEnabled: normalizedValues.announcementEnabled,
          announcementText: nullable(normalizedValues.announcementText),
          announcementUrl: nullable(normalizedValues.announcementUrl),
        }),
        mutations.settings.mutateAsync({
          isPublished: normalizedValues.isPublished,
          contactFormEnabled: store.settings.data.contactFormEnabled,
          showPrices: normalizedValues.showPrices,
          allowNegativeStock: store.settings.data.allowNegativeStock,
          defaultCatalogSort: normalizedValues.defaultCatalogSort,
          catalogColumnsDesktop: normalizedValues.catalogColumnsDesktop,
        }),
      ]);
      form.reset(normalizedValues);
    } catch {
      // Mutation hooks surface the error; keeping the form untouched preserves the draft.
    }
  });

  const isLoading = session.isPending || store.profile.isPending || store.settings.isPending || store.theme.isPending;
  const isError = session.isError || store.profile.isError || store.settings.isError || store.theme.isError;
  const queryError = session.error ?? store.profile.error ?? store.settings.error ?? store.theme.error;

  return (
    <div className="page-shell">
      <PageHeader
        title="Información y apariencia"
        description="Actualizá la identidad pública de Rubí y cómo se presenta el catálogo."
        actions={
          <Button asChild variant="outline">
            <a href={publicUrl} target="_blank" rel="noreferrer">
              <ExternalLink aria-hidden="true" />
              Ver tienda
            </a>
          </Button>
        }
      />

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={queryError}
        onRetry={() => {
          void Promise.all([
            session.refetch(),
            store.profile.refetch(),
            store.settings.refetch(),
            store.theme.refetch(),
          ]);
        }}
      >
        <form className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,.65fr)]" onSubmit={submit} noValidate>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <SectionHeading
                  icon={<Store className="size-4.5" aria-hidden="true" />}
                  title="Información comercial"
                  description="Datos públicos que ayudan a tus clientes a reconocer y encontrar el comercio."
                />
              </CardHeader>
              <CardContent className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="brandName">Nombre comercial</Label>
                  <Input
                    id="brandName"
                    autoComplete="organization"
                    aria-invalid={Boolean(form.formState.errors.brandName)}
                    {...form.register("brandName")}
                  />
                  <FieldMessage message={form.formState.errors.brandName?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenantSlug">Slug de la tienda</Label>
                  <Input id="tenantSlug" value={session.data?.tenant.slug ?? ""} readOnly className="bg-muted/50" />
                  <p className="text-xs text-muted-foreground">La identidad técnica del comercio no se edita desde esta pantalla.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email de contacto</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    autoComplete="email"
                    aria-invalid={Boolean(form.formState.errors.contactEmail)}
                    {...form.register("contactEmail")}
                  />
                  <FieldMessage message={form.formState.errors.contactEmail?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono público</Label>
                  <Input id="phone" type="tel" autoComplete="tel" {...form.register("phone")} />
                  <FieldMessage message={form.formState.errors.phone?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressLine">Calle</Label>
                  <Input id="addressLine" autoComplete="address-line1" {...form.register("addressLine")} />
                  <FieldMessage message={form.formState.errors.addressLine?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressNumber">Número</Label>
                  <Input id="addressNumber" inputMode="numeric" {...form.register("addressNumber")} />
                  <FieldMessage message={form.formState.errors.addressNumber?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input id="city" autoComplete="address-level2" {...form.register("city")} />
                  <FieldMessage message={form.formState.errors.city?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Provincia</Label>
                  <Input id="province" autoComplete="address-level1" {...form.register("province")} />
                  <FieldMessage message={form.formState.errors.province?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Código postal</Label>
                  <Input id="postalCode" autoComplete="postal-code" {...form.register("postalCode")} />
                  <FieldMessage message={form.formState.errors.postalCode?.message} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <SectionHeading
                  icon={<Palette className="size-4.5" aria-hidden="true" />}
                  title="Apariencia"
                  description="Definí una combinación consistente de color, tipografía y bordes."
                />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <ColorField control={form.control} name="primaryColor" label="Color principal" fallback="#74263A" />
                  <ColorField control={form.control} name="secondaryColor" label="Color secundario" fallback="#312A2B" />
                  <ColorField control={form.control} name="backgroundColor" label="Fondo" fallback="#F8F6F1" />
                  <ColorField control={form.control} name="textColor" label="Texto" fallback="#292526" />
                </div>
                <Separator />
                <div className="grid gap-5 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="headingFont">Tipografía de títulos</Label>
                    <Select id="headingFont" {...form.register("headingFont")}>
                      <option value="Merriweather">Merriweather</option>
                      <option value="Playfair Display">Playfair Display</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Inter">Inter</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bodyFont">Tipografía de texto</Label>
                    <Select id="bodyFont" {...form.register("bodyFont")}>
                      <option value="Lora">Lora</option>
                      <option value="Inter">Inter</option>
                      <option value="Arial">Arial</option>
                      <option value="Georgia">Georgia</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="borderRadius">Estilo de bordes</Label>
                    <Select id="borderRadius" {...form.register("borderRadius")}>
                      <option value="0rem">Rectos</option>
                      <option value="0.375rem">Suaves</option>
                      <option value="0.75rem">Redondeados</option>
                      <option value="1rem">Muy redondeados</option>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <SectionHeading
                  icon={<Megaphone className="size-4.5" aria-hidden="true" />}
                  title="Mensaje superior"
                  description="Comunicá información importante en la parte superior de la tienda."
                />
              </CardHeader>
              <CardContent className="space-y-5">
                <Controller
                  control={form.control}
                  name="announcementEnabled"
                  render={({ field }) => (
                    <SwitchRow
                      id="announcementEnabled"
                      title="Mostrar anuncio"
                      description="El mensaje aparecerá en todas las páginas públicas."
                      checked={field.value}
                      disabled={saving}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="announcementText">Mensaje</Label>
                    <Input
                      id="announcementText"
                      maxLength={120}
                      readOnly={!previewValues.announcementEnabled}
                      aria-disabled={!previewValues.announcementEnabled}
                      className={!previewValues.announcementEnabled ? "bg-muted/50 opacity-70" : undefined}
                      aria-invalid={Boolean(form.formState.errors.announcementText)}
                      {...form.register("announcementText")}
                    />
                    <FieldMessage message={form.formState.errors.announcementText?.message} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="announcementUrl">Enlace opcional</Label>
                    <Input
                      id="announcementUrl"
                      type="url"
                      placeholder="https://"
                      readOnly={!previewValues.announcementEnabled}
                      aria-disabled={!previewValues.announcementEnabled}
                      className={!previewValues.announcementEnabled ? "bg-muted/50 opacity-70" : undefined}
                      aria-invalid={Boolean(form.formState.errors.announcementUrl)}
                      {...form.register("announcementUrl")}
                    />
                    <FieldMessage message={form.formState.errors.announcementUrl?.message} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <SectionHeading
                  icon={<Globe2 className="size-4.5" aria-hidden="true" />}
                  title="Publicación y catálogo"
                  description="Controlá la visibilidad de la tienda y el orden inicial de los productos."
                />
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Controller
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <SwitchRow
                        id="isPublished"
                        title="Tienda pública"
                        description="Si la ocultás, el administrador seguirá disponible."
                        checked={field.value}
                        disabled={saving}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="showPrices"
                    render={({ field }) => (
                      <SwitchRow
                        id="showPrices"
                        title="Mostrar precios"
                        description="Ocultalos si preferís recibir consultas."
                        checked={field.value}
                        disabled={saving}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="defaultCatalogSort">Orden predeterminado</Label>
                    <Select id="defaultCatalogSort" {...form.register("defaultCatalogSort")}>
                      <option value="FEATURED">Destacados</option>
                      <option value="NEWEST">Más nuevos</option>
                      <option value="PRICE_ASC">Menor precio</option>
                      <option value="PRICE_DESC">Mayor precio</option>
                      <option value="NAME_ASC">Nombre de A a Z</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="catalogColumnsDesktop">Columnas en escritorio</Label>
                    <Select
                      id="catalogColumnsDesktop"
                      {...form.register("catalogColumnsDesktop", { valueAsNumber: true })}
                    >
                      <option value={2}>2 columnas</option>
                      <option value={3}>3 columnas</option>
                      <option value={4}>4 columnas</option>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <MutationErrorNotice error={saveError} />
            <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                {form.formState.isDirty ? "Tenés cambios sin guardar." : "La configuración está al día."}
              </p>
              <Button type="submit" disabled={saving || !form.formState.isDirty}>
                {saving ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Save aria-hidden="true" />}
                {saving ? "Guardando…" : "Guardar cambios"}
              </Button>
            </div>
          </div>

          <IdentityPreview values={previewValues} />
        </form>
      </QueryState>
    </div>
  );
}
