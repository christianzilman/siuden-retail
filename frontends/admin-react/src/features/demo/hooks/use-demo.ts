import { usePosStore } from "@/features/pos/store/pos-store";
import { errorMessage } from "@/lib/error-message";
import { services } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useResetDemoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: services.demo.reset,
    onSuccess: async () => {
      usePosStore.getState().clear();
      await queryClient.resetQueries();
      toast.success("Datos de demostración restablecidos");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}
