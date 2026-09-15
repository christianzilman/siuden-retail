import type { CategoryService } from "@/features/categories/types/contracts";
import { type HttpRequest } from "@/services/http-services";

export function createCategoriesApi(request: HttpRequest): CategoryService {

  return {
    list: () => request("/categories"),
    create: (input) =>
      request("/categories", { method: "POST", body: JSON.stringify(input) }),
    update: (id, input) =>
      request(`/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input),
      }),
    async remove(id) {
      await request(`/categories/${id}`, { method: "DELETE" });
    },
    async delete(id) {
      await request(`/categories/${id}`, { method: "DELETE" });
    },
    reorder: (input) =>
      request("/categories/reorder", {
        method: "POST",
        body: JSON.stringify(input),
      }),
  };
}
