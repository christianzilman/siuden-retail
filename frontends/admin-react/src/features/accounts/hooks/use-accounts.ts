import type { AccountFilters, CreateAccountInput } from "@/features/accounts/types/contracts";
import { queryKeys } from "@/lib/query-keys";
import { services } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAccountsQuery(filters: AccountFilters = {}) {
  return useQuery({
    queryKey: queryKeys.accounts(filters),
    queryFn: () => services.accounts.list(filters),
  });
}

export function useCreateAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAccountInput) => services.accounts.create(input),
    onSuccess: async (account) => {
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success(`Cuenta ${account.name} creada correctamente.`);
    },
  });
}
