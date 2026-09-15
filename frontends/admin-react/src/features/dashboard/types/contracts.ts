import type { DashboardSummary } from "@/features/dashboard/types/dashboard";

export interface DashboardService {
  get(): Promise<DashboardSummary>;
}
