import { ProductsPage } from "@/features/catalog";
import { StorefrontPage } from "@/features/storefront";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StorefrontPage />} />
        <Route path="/:tenantSlug/productos" element={<ProductsPage />} />
        <Route path="/:tenantSlug/*" element={<StorefrontPage />} />
      </Routes>
    </BrowserRouter>
  );
};
