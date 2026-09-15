import type { DashboardService } from "@/features/dashboard/types/contracts";
import { type HttpRequest } from "@/services/http-services";

export function createDashboardApi(request: HttpRequest): DashboardService {

  return { get: () => request("/dashboard") };
}
