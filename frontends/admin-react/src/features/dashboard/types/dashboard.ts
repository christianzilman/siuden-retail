import type { InventoryItem, StockMovement } from "@/features/inventory/types/inventory";
import type { Sale } from "@/features/sales/types/sales";

export interface DashboardSummary {
  publishedProducts: number;
  variants: number;
  availableUnits: number;
  lowStockItems: number;
  salesToday: number;
  totalSoldToday: number;
  currency: string;
  lowStockProducts: InventoryItem[];
  recentMovements: StockMovement[];
  recentSales: Sale[];
}
