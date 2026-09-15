import { createAccountsApi } from "@/features/accounts/api/accounts.api";
import { createAuthApi } from "@/features/auth/api/auth.api";
import { createCategoriesApi } from "@/features/categories/api/categories.api";
import { createCustomersApi } from "@/features/customers/api/customers.api";
import { createDashboardApi } from "@/features/dashboard/api/dashboard.api";
import { createDemoApi } from "@/features/demo/api/demo.api";
import { createInventoryApi } from "@/features/inventory/api/inventory.api";
import { createProductsApi } from "@/features/products/api/products.api";
import { createSalesApi } from "@/features/sales/api/sales.api";
import { createStoreApi } from "@/features/settings/api/settings.api";
import type { Services } from "@/services/contracts";
import { createHttpRequest } from "@/services/http-services";

export function createHttpServices(): Services {
  const request = createHttpRequest();
  return {
    auth: createAuthApi(request),
    accounts: createAccountsApi(request),
    dashboard: createDashboardApi(request),
    products: createProductsApi(request),
    categories: createCategoriesApi(request),
    inventory: createInventoryApi(request),
    customers: createCustomersApi(request),
    sales: createSalesApi(request),
    store: createStoreApi(request),
    demo: createDemoApi()
  };
}
