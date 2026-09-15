import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { QueryState } from "@/components/shared/query-state";
import { DashboardContent } from "@/features/dashboard/components/dashboard-content";
import { useDashboardQuery } from "@/features/dashboard/hooks/use-dashboard";

export function DashboardPage() {
  const dashboard = useDashboardQuery();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Una vista rápida del catálogo, el inventario y las ventas de Rubí Joyería."
      />
      <QueryState
        isLoading={dashboard.isLoading}
        isError={dashboard.isError}
        error={dashboard.error}
        onRetry={() => void dashboard.refetch()}
        isEmpty={!dashboard.data}
        emptyFallback={
          <EmptyState
            title="No hay información para mostrar"
            description="Restablecé los datos de demostración o intentá nuevamente."
          />
        }
      >
        {dashboard.data ? <DashboardContent data={dashboard.data} /> : null}
      </QueryState>
    </div>
  );
}
