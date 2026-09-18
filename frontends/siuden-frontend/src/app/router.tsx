import { StorefrontPage } from "../features/storefront/pages/StorefrontPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StorefrontPage />} />
        <Route path="/:tenantSlug/*" element={<StorefrontPage />} />
      </Routes>
    </BrowserRouter>
  );
};
