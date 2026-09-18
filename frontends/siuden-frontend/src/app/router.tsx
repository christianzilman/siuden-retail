import { StorefrontPage } from "../features/storefront/pages/StorefrontPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export const AppRouter = () => {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StorefrontPage />} />
            <Route path="/:tenantSlug/*" element={<StorefrontPage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
};
