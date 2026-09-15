import { useTenant } from "@/features/auth/hooks/use-auth";
import { queryKeys } from "@/lib/query-keys";
import { services } from "@/services";
import { useQuery } from "@tanstack/react-query";

export function useDashboardQuery() {
  const tenant = useTenant();
  return useQuery({
    queryKey: queryKeys.dashboard(tenant.tenantId),
    queryFn: () => services.dashboard.get(),
    enabled: tenant.enabled,
  });
}
