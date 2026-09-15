import { useTenant } from "@/features/auth/hooks/use-auth";
import type { StoreContactChannelInput, UpdateStoreProfileInput, UpdateStoreThemeInput, UpdateStorefrontSettingsInput } from "@/features/settings/types/contracts";
import { errorMessage } from "@/lib/error-message";
import { queryKeys } from "@/lib/query-keys";
import { services } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useStoreQueries() {
  const tenant = useTenant();
  return {
    profile: useQuery({
      queryKey: queryKeys.storeProfile(tenant.tenantId),
      queryFn: services.store.getProfile,
      enabled: tenant.enabled,
    }),
    settings: useQuery({
      queryKey: queryKeys.storefrontSettings(tenant.tenantId),
      queryFn: services.store.getSettings,
      enabled: tenant.enabled,
    }),
    theme: useQuery({
      queryKey: queryKeys.storeTheme(tenant.tenantId),
      queryFn: services.store.getTheme,
      enabled: tenant.enabled,
    }),
    contacts: useQuery({
      queryKey: queryKeys.storeContactChannels(tenant.tenantId),
      queryFn: services.store.getContactChannels,
      enabled: tenant.enabled,
    }),
  };
}

export function useStoreMutations() {
  const queryClient = useQueryClient();
  const { tenantId } = useTenant();
  return {
    profile: useMutation({
      mutationFn: (input: UpdateStoreProfileInput) => services.store.updateProfile(input),
      onSuccess: async (profile) => {
        queryClient.setQueryData(queryKeys.storeProfile(tenantId), profile);
        await queryClient.invalidateQueries({ queryKey: queryKeys.session });
        toast.success("Información del comercio guardada");
      },
      onError: (error) => toast.error(errorMessage(error)),
    }),
    settings: useMutation({
      mutationFn: (input: UpdateStorefrontSettingsInput) => services.store.updateSettings(input),
      onSuccess: (settings) => {
        queryClient.setQueryData(queryKeys.storefrontSettings(tenantId), settings);
        toast.success("Preferencias de la tienda guardadas");
      },
      onError: (error) => toast.error(errorMessage(error)),
    }),
    theme: useMutation({
      mutationFn: (input: UpdateStoreThemeInput) => services.store.updateTheme(input),
      onSuccess: async (theme) => {
        queryClient.setQueryData(queryKeys.storeTheme(tenantId), theme);
        await queryClient.invalidateQueries({ queryKey: queryKeys.session });
        toast.success("Apariencia actualizada");
      },
      onError: (error) => toast.error(errorMessage(error)),
    }),
    contacts: useMutation({
      mutationFn: (input: StoreContactChannelInput[]) =>
        services.store.updateContactChannels(input),
      onSuccess: (contacts) => {
        queryClient.setQueryData(queryKeys.storeContactChannels(tenantId), contacts);
        toast.success("Canales de contacto guardados");
      },
      onError: (error) => toast.error(errorMessage(error)),
    }),
  };
}
