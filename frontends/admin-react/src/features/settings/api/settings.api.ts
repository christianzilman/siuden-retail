import type { StoreService } from "@/features/settings/types/contracts";
import { type HttpRequest } from "@/services/http-services";

export function createStoreApi(request: HttpRequest): StoreService {

  return {
    getProfile: () => request("/store/profile"),
    updateProfile: (input) =>
      request("/store/profile", {
        method: "PUT",
        body: JSON.stringify(input),
      }),
    getSettings: () => request("/store/settings"),
    updateSettings: (input) =>
      request("/store/settings", {
        method: "PUT",
        body: JSON.stringify(input),
      }),
    getTheme: () => request("/store/theme"),
    updateTheme: (input) =>
      request("/store/theme", { method: "PUT", body: JSON.stringify(input) }),
    getContactChannels: () => request("/store/contacts"),
    updateContactChannels: (items) =>
      request("/store/contacts", {
        method: "PUT",
        body: JSON.stringify({ items }),
      }),
  };
}
