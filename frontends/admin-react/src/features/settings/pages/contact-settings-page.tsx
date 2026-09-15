import { PageHeader, QueryState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FieldMessage } from "@/features/settings/components/field-message";
import { MutationErrorNotice } from "@/features/settings/components/mutation-error-notice";
import { SectionHeading } from "@/features/settings/components/section-heading";
import { SwitchRow } from "@/features/settings/components/switch-row";
import { useStoreMutations, useStoreQueries } from "@/features/settings/hooks/use-settings";
import { useUnsavedChangesWarning } from "@/features/settings/hooks/use-unsaved-changes-warning";
import type { StoreContactChannelInput } from "@/features/settings/types/contracts";
import type { ContactSettingsValues } from "@/features/settings/types/forms";
import { argentinaLocalDigits, contactValue, DEFAULT_CONTACT_VALUES, normalizeSocialHandle, normalizeWhatsapp, nullable, socialUrl } from "@/features/settings/utils/settings-helpers";
import { contactSettingsSchema } from "@/features/settings/validations/settings.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, LoaderCircle, Mail, MapPin, MessageCircle, Save, Smartphone, UsersRound } from "lucide-react";
import { useEffect, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

export function ContactSettingsPage() {
  const store = useStoreQueries();
  const mutations = useStoreMutations();
  const initialized = useRef(false);
  const form = useForm<ContactSettingsValues>({
    resolver: zodResolver(contactSettingsSchema),
    defaultValues: DEFAULT_CONTACT_VALUES,
  });

  const ready = Boolean(store.settings.data && store.contacts.data);
  useEffect(() => {
    if (!ready || !store.settings.data || !store.contacts.data || initialized.current) return;
    const contacts = store.contacts.data;
    const whatsapp = contacts.find((channel) => channel.channelType === "WHATSAPP");
    const instagram = contacts.find((channel) => channel.channelType === "INSTAGRAM");
    const facebook = contacts.find((channel) => channel.channelType === "FACEBOOK");
    form.reset({
      whatsapp: normalizeWhatsapp(contactValue(contacts, "WHATSAPP")).display,
      whatsappEnabled: whatsapp?.enabled ?? false,
      instagram: normalizeSocialHandle(contactValue(contacts, "INSTAGRAM"), "instagram"),
      instagramEnabled: instagram?.enabled ?? false,
      facebook: normalizeSocialHandle(contactValue(contacts, "FACEBOOK"), "facebook"),
      facebookEnabled: facebook?.enabled ?? false,
      contactFormEnabled: store.settings.data.contactFormEnabled,
    });
    initialized.current = true;
  }, [form, ready, store.contacts.data, store.settings.data]);

  useUnsavedChangesWarning(form.formState.isDirty);

  const watched = useWatch({ control: form.control }) as ContactSettingsValues;
  const normalizedWhatsapp = normalizeWhatsapp(watched.whatsapp);
  const saving = mutations.contacts.isPending || mutations.settings.isPending;
  const saveError = mutations.contacts.error ?? mutations.settings.error;

  const submit = form.handleSubmit(async (values) => {
    if (!store.contacts.data || !store.settings.data) return;

    const whatsapp = normalizeWhatsapp(values.whatsapp);
    const instagram = normalizeSocialHandle(values.instagram, "instagram");
    const facebook = normalizeSocialHandle(values.facebook, "facebook");
    const editedTypes = new Set(["WHATSAPP", "INSTAGRAM", "FACEBOOK"]);
    const existingByType = new Map(store.contacts.data.map((channel) => [channel.channelType, channel]));
    const untouched: StoreContactChannelInput[] = store.contacts.data
      .filter((channel) => !editedTypes.has(channel.channelType))
      .map((channel) => ({
        id: channel.id,
        channelType: channel.channelType,
        value: channel.value,
        url: channel.url,
        enabled: channel.enabled,
        sortOrder: channel.sortOrder,
      }));

    const channelInput = (
      channelType: "WHATSAPP" | "INSTAGRAM" | "FACEBOOK",
      value: string,
      url: string | null,
      enabled: boolean,
      fallbackSortOrder: number,
    ): StoreContactChannelInput => {
      const existing = existingByType.get(channelType);
      return {
        id: existing?.id,
        channelType,
        value: nullable(value),
        url,
        enabled: enabled && Boolean(value),
        sortOrder: existing?.sortOrder ?? fallbackSortOrder,
      };
    };

    const normalizedValues: ContactSettingsValues = {
      ...values,
      whatsapp: whatsapp.display,
      instagram,
      facebook,
    };

    try {
      await Promise.all([
        mutations.contacts.mutateAsync([
          channelInput("WHATSAPP", whatsapp.display, whatsapp.url, values.whatsappEnabled, 0),
          channelInput("INSTAGRAM", instagram, socialUrl("instagram", instagram), values.instagramEnabled, 1),
          channelInput("FACEBOOK", facebook, socialUrl("facebook", facebook), values.facebookEnabled, 2),
          ...untouched,
        ]),
        mutations.settings.mutateAsync({
          isPublished: store.settings.data.isPublished,
          contactFormEnabled: values.contactFormEnabled,
          showPrices: store.settings.data.showPrices,
          allowNegativeStock: store.settings.data.allowNegativeStock,
          defaultCatalogSort: store.settings.data.defaultCatalogSort,
          catalogColumnsDesktop: store.settings.data.catalogColumnsDesktop,
        }),
      ]);
      form.reset(normalizedValues);
    } catch {
      // Mutation hooks surface the error; keeping the form untouched preserves the draft.
    }
  });

  const isLoading = store.settings.isPending || store.contacts.isPending;
  const isError = store.settings.isError || store.contacts.isError;
  const queryError = store.settings.error ?? store.contacts.error;

  return (
    <div className="page-shell">
      <PageHeader
        title="Contacto y redes"
        description="Centralizá los canales públicos que tus clientes usan para hablar con Rubí."
      />

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={queryError}
        onRetry={() => {
          void Promise.all([store.settings.refetch(), store.contacts.refetch()]);
        }}
      >
        <form className="space-y-6" onSubmit={submit} noValidate>
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <SectionHeading
                  icon={<MessageCircle className="size-4.5" aria-hidden="true" />}
                  title="Canales directos"
                  description="Aceptamos un usuario o una URL; al guardar normalizamos cada vínculo."
                />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-5 rounded-lg border p-4 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Smartphone className="size-4 text-emerald-600" aria-hidden="true" />
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                    </div>
                    <Controller
                      control={form.control}
                      name="whatsapp"
                      render={({ field, fieldState }) => (
                        <>
                          <Input
                            id="whatsapp"
                            ref={field.ref}
                            name={field.name}
                            value={field.value}
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            placeholder="381 677-6136"
                            aria-invalid={Boolean(fieldState.error)}
                            onChange={field.onChange}
                            onBlur={() => {
                              field.onBlur();
                              if (argentinaLocalDigits(field.value).length === 10) {
                                form.setValue("whatsapp", normalizeWhatsapp(field.value).display, {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                });
                              }
                            }}
                          />
                          <FieldMessage message={fieldState.error?.message} />
                        </>
                      )}
                    />
                    <p className="text-xs text-muted-foreground">
                      {normalizedWhatsapp.url
                        ? `Se vinculará como ${normalizedWhatsapp.display}.`
                        : "Incluí código de área; agregaremos +54 9 automáticamente."}
                    </p>
                  </div>
                  <Controller
                    control={form.control}
                    name="whatsappEnabled"
                    render={({ field }) => (
                      <div className="flex items-center gap-2 sm:pt-7">
                        <Switch
                          id="whatsappEnabled"
                          checked={field.value}
                          disabled={saving}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="whatsappEnabled">Activo</Label>
                      </div>
                    )}
                  />
                </div>

                <div className="grid gap-5 rounded-lg border p-4 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AtSign className="size-4 text-fuchsia-600" aria-hidden="true" />
                      <Label htmlFor="instagram">Instagram</Label>
                    </div>
                    <Controller
                      control={form.control}
                      name="instagram"
                      render={({ field, fieldState }) => (
                        <>
                          <Input
                            id="instagram"
                            ref={field.ref}
                            name={field.name}
                            value={field.value}
                            placeholder="@rubijoyerias"
                            aria-invalid={Boolean(fieldState.error)}
                            onChange={field.onChange}
                            onBlur={() => {
                              field.onBlur();
                              form.setValue("instagram", normalizeSocialHandle(field.value, "instagram"), {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                            }}
                          />
                          <FieldMessage message={fieldState.error?.message} />
                        </>
                      )}
                    />
                    <p className="text-xs text-muted-foreground">Usuario o enlace completo de Instagram.</p>
                  </div>
                  <Controller
                    control={form.control}
                    name="instagramEnabled"
                    render={({ field }) => (
                      <div className="flex items-center gap-2 sm:pt-7">
                        <Switch
                          id="instagramEnabled"
                          checked={field.value}
                          disabled={saving}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="instagramEnabled">Activo</Label>
                      </div>
                    )}
                  />
                </div>

                <div className="grid gap-5 rounded-lg border p-4 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UsersRound className="size-4 text-blue-600" aria-hidden="true" />
                      <Label htmlFor="facebook">Facebook</Label>
                    </div>
                    <Controller
                      control={form.control}
                      name="facebook"
                      render={({ field, fieldState }) => (
                        <>
                          <Input
                            id="facebook"
                            ref={field.ref}
                            name={field.name}
                            value={field.value}
                            placeholder="rubijoyerias"
                            aria-invalid={Boolean(fieldState.error)}
                            onChange={field.onChange}
                            onBlur={() => {
                              field.onBlur();
                              form.setValue("facebook", normalizeSocialHandle(field.value, "facebook"), {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                            }}
                          />
                          <FieldMessage message={fieldState.error?.message} />
                        </>
                      )}
                    />
                    <p className="text-xs text-muted-foreground">Nombre de página o enlace completo de Facebook.</p>
                  </div>
                  <Controller
                    control={form.control}
                    name="facebookEnabled"
                    render={({ field }) => (
                      <div className="flex items-center gap-2 sm:pt-7">
                        <Switch
                          id="facebookEnabled"
                          checked={field.value}
                          disabled={saving}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="facebookEnabled">Activo</Label>
                      </div>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <SectionHeading
                    icon={<Mail className="size-4.5" aria-hidden="true" />}
                    title="Formulario de contacto"
                    description="Recibí consultas desde la tienda pública."
                  />
                </CardHeader>
                <CardContent>
                  <Controller
                    control={form.control}
                    name="contactFormEnabled"
                    render={({ field }) => (
                      <SwitchRow
                        id="contactFormEnabled"
                        title="Formulario activo"
                        description="Las consultas se enviarán al email configurado en Información del comercio."
                        checked={field.value}
                        disabled={saving}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="border-b bg-muted/20">
                  <CardTitle className="text-sm">Así se verán los enlaces</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-5">
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <MessageCircle className="size-4 text-emerald-600" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">WhatsApp</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {normalizedWhatsapp.display || "Sin configurar"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <AtSign className="size-4 text-fuchsia-600" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Instagram</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {normalizeSocialHandle(watched.instagram, "instagram") || "Sin configurar"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <UsersRound className="size-4 text-blue-600" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Facebook</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {normalizeSocialHandle(watched.facebook, "facebook") || "Sin configurar"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-3 text-xs leading-5 text-muted-foreground">
                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
                    Los canales se muestran solo cuando están activos y tienen un valor válido.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <MutationErrorNotice error={saveError} />
          <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {form.formState.isDirty ? "Tenés cambios sin guardar." : "Los canales están al día."}
            </p>
            <Button type="submit" disabled={saving || !form.formState.isDirty}>
              {saving ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Save aria-hidden="true" />}
              {saving ? "Guardando…" : "Guardar contacto"}
            </Button>
          </div>
        </form>
      </QueryState>
    </div>
  );
}
