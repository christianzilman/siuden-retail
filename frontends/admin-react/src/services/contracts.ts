import type { AccountService } from "@/features/accounts/types/contracts";
import type { AuthService } from "@/features/auth/types/contracts";
import type { CategoryService } from "@/features/categories/types/contracts";
import type { CustomerService } from "@/features/customers/types/contracts";
import type { DashboardService } from "@/features/dashboard/types/contracts";
import type { DemoService } from "@/features/demo/types/contracts";
import type { InventoryService } from "@/features/inventory/types/contracts";
import type { ProductService } from "@/features/products/types/contracts";
import type { SaleService } from "@/features/sales/types/contracts";
import type { StoreService } from "@/features/settings/types/contracts";

export interface Services {
  auth: AuthService;
  accounts: AccountService;
  dashboard: DashboardService;
  products: ProductService;
  categories: CategoryService;
  inventory: InventoryService;
  customers: CustomerService;
  sales: SaleService;
  store: StoreService;
  demo: DemoService;
}
