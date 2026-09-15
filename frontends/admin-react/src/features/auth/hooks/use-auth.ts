import type { PermissionCode, TenantFeatureCode } from "@/features/auth/types/auth";
import type { LoginInput } from "@/features/auth/types/contracts";
import { usePosStore } from "@/features/pos/store/pos-store";
import { queryKeys } from "@/lib/query-keys";
import { services } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useSessionQuery() {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: () => services.auth.me(),
    staleTime: 30_000,
    retry: false,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => services.auth.login(input),
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.session, session);
      usePosStore.getState().initialize(session.tenant.id);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => services.auth.logout(),
    onSuccess: () => {
      usePosStore.getState().clear();
      queryClient.clear();
      queryClient.setQueryData(queryKeys.session, null);
    },
  });
}

export function usePermission(permission: PermissionCode): boolean {
  const { data: session } = useSessionQuery();
  return session?.membership.permissions.includes(permission) ?? false;
}

export function useTenantFeature(feature: TenantFeatureCode): boolean {
  const { data: session } = useSessionQuery();
  return session?.tenant.enabledFeatures.includes(feature) ?? false;
}

export function useTenant() {
  const session = useSessionQuery();
  return {
    ...session,
    tenantId: session.data?.tenant.id ?? "",
    enabled: Boolean(session.data?.tenant.id),
  };
}
