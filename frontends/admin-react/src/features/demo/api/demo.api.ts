import type { DemoService } from "@/features/demo/types/contracts";
import { HttpServiceError } from "@/services/http-services";

export function createDemoApi(): DemoService {

  return {
    async reset() {
      throw new HttpServiceError(
        "El restablecimiento demo no está disponible usando la API real.",
        409,
      );
    },
  };
}
