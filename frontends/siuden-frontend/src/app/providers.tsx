import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";
import { AuthSessionInitializer } from "@/features/auth/components/AuthSessionInitializer";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionInitializer>{children}</AuthSessionInitializer>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
