import { AuthDialog } from "@/features/auth/components/AuthDialog";
import type { Category, Product, PublicTenant } from "@/features/catalog/types/catalog.types";
import {
  categoryProductsHref,
  flattenCategories,
} from "@/features/catalog/utils/catalog.utils";
import { formatPrice } from "@/lib/format";
import { ChevronDown, X, Search, Camera, Menu } from "lucide-react";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { Link, useLocation } from "react-router-dom";

interface CategoryMenuItemsProps {
  categories: Category[];
  tenantSlug: string;
}

const CategoryMenuItems = ({ categories, tenantSlug }: CategoryMenuItemsProps) =>
  categories
    .filter((category) => category.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((category) => (
      <div className="group/category-item relative" key={category.id}>
        <Link
          className="flex min-h-11 items-center justify-between gap-4 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--store-background)] hover:text-[var(--store-primary)]"
          to={categoryProductsHref(tenantSlug, category)}
        >
          {category.name}
          {category.children.some((child) => child.isVisible) ? (
            <ChevronDown className="size-4 -rotate-90" />
          ) : null}
        </Link>
        {category.children.some((child) => child.isVisible) ? (
          <div className="absolute left-full top-0 z-10 hidden min-w-56 border-l border-[var(--store-hairline)] bg-[var(--store-surface)] p-2 shadow-[0_18px_45px_rgb(0_0_0_/_0.12)] group-hover/category-item:block group-focus-within/category-item:block">
            <CategoryMenuItems
              categories={category.children}
              tenantSlug={tenantSlug}
            />
          </div>
        ) : null}
      </div>
    ));

interface HeaderProps {
  categories: Category[];
  products: Product[];
  tenantName: string;
  tenantSlug: string;
  tenant?: PublicTenant;
}

export const Header = ({
  categories,
  products,
  tenantName,
  tenantSlug,
  tenant,
}: HeaderProps) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [auth, setAuth] = useState<"login" | "register" | null>(null);
  const session = useAuthStore((state) => state.session);
  const status = useAuthStore((state) => state.status);
  const setAnonymous = useAuthStore((state) => state.setAnonymous);
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => setAnonymous(),
  });
  const results = useMemo(
    () =>
      products
        .filter((product) =>
          `${product.name} ${product.description ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .slice(0, 5),
    [products, query],
  );

  return (
    <>
      <div className="border-b border-[var(--store-hairline)] bg-white/80">
        <div className="mx-auto flex min-h-9 w-[min(100%-2rem,86rem)] items-center justify-end gap-2 text-xs text-[var(--store-muted)]">
          {status === "authenticated" && session ? (
            <>
              <span className="max-w-48 truncate" title={session.email}>
                {session.email}
              </span>
              <span>|</span>
              <button
                disabled={logoutMutation.isPending}
                onClick={() => logoutMutation.mutate()}
              >
                {logoutMutation.isPending ? "Cerrando…" : "Cerrar sesión"}
              </button>
            </>
          ) : status === "anonymous" ? (
            <>
              <button onClick={() => setAuth("register")}>Crear cuenta</button>
              <span>|</span>
              <button onClick={() => setAuth("login")}>Iniciar sesión</button>
            </>
          ) : (
            <span>Comprobando sesión…</span>
          )}
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-[var(--store-hairline)] bg-[color:rgb(248_246_241_/_0.94)] backdrop-blur-md">
        <div className="mx-auto flex h-20 w-[min(100%-2rem,86rem)] items-center justify-between gap-5 lg:h-24">
          <Link
            className="flex items-center gap-3"
            to={`/${tenantSlug}#inicio`}
          >
            {tenant?.logoUrl ? (
              <img className="size-10 object-contain" src={tenant.logoUrl} alt="" />
            ) : (
              <span className="grid size-9 place-items-center rounded-full border border-[var(--store-accent)] font-serif text-xl italic text-[var(--store-primary)]">
                {tenantName.trim().charAt(0).toLocaleUpperCase("es") || "S"}
              </span>
            )}
            <span className="font-serif text-3xl tracking-[.08em]">
              {tenantName}
            </span>
          </Link>
          <nav className="hidden items-center gap-9 text-sm lg:flex">
            <Link to={`/${tenantSlug}#inicio`}>Inicio</Link>
            <Link to={`/${tenantSlug}/productos`}>Productos</Link>
            <details
              className="group/category-menu relative"
              key={location.key}
            >
              <summary className="flex cursor-pointer list-none items-center gap-1.5">
                Categorías <ChevronDown className="size-4" />
              </summary>
              <div className="absolute left-1/2 top-[calc(100%+1.5rem)] hidden w-56 -translate-x-1/2 bg-[var(--store-surface)] p-2 shadow-[0_18px_45px_rgb(0_0_0_/_0.12)] group-open/category-menu:block">
                <CategoryMenuItems
                  categories={categories}
                  tenantSlug={tenantSlug}
                />
              </div>
            </details>
            <Link to={`/${tenantSlug}#contacto`}>Contacto</Link>
          </nav>
          <div className="flex items-center gap-1">
            <button
              className="grid size-11 place-items-center rounded-full hover:bg-white"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Buscar"
            >
              <Search className="size-5" />
            </button>
            <a
              className="hidden size-11 place-items-center rounded-full hover:bg-white sm:grid"
              href="https://www.instagram.com/rubijoyerias"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <Camera className="size-5" />
            </a>
            <button
              className="grid size-11 place-items-center rounded-full hover:bg-white lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
        {searchOpen ? (
          <div className="absolute left-0 top-full w-full border-t border-[var(--store-hairline)] bg-white p-5 shadow-xl">
            <div className="mx-auto w-[min(100%,50rem)]">
              <div className="flex items-center gap-3 border-b pb-3">
                <Search className="size-5" />
                <input
                  className="min-w-0 flex-1 outline-none"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar anillos, plata, relojes…"
                  autoFocus
                />
                <button onClick={() => setSearchOpen(false)}>Cerrar</button>
              </div>
              <div className="grid sm:grid-cols-2">
                {results.map((product) => (
                  <Link
                    className="flex justify-between border-b py-3 text-sm"
                    to={`/${tenantSlug}/productos/${product.slug}`}
                    key={product.id}
                    onClick={() => setSearchOpen(false)}
                  >
                    <span>
                      {product.name}
                      <small className="block max-w-80 truncate text-[var(--store-muted)]">
                        {product.description || "Producto del catálogo"}
                      </small>
                    </span>
                    <span>{formatPrice(product.price)}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 bg-[var(--store-secondary)] p-6 text-white lg:hidden">
          <button
            className="ml-auto grid size-11 place-items-center"
            onClick={() => setMenuOpen(false)}
          >
            <X />
          </button>
          <nav className="mt-12 grid gap-7 font-serif text-4xl">
            <Link to={`/${tenantSlug}#inicio`} onClick={() => setMenuOpen(false)}>
              Inicio
            </Link>
            <Link to={`/${tenantSlug}/productos`} onClick={() => setMenuOpen(false)}>
              Productos
            </Link>
            <Link to={`/${tenantSlug}#categorias`} onClick={() => setMenuOpen(false)}>
              Categorías
            </Link>
            <div className="grid gap-3 border-l border-white/20 pl-4 font-sans text-base text-white/70">
              {flattenCategories(categories).map((category) => (
                <Link
                  to={categoryProductsHref(tenantSlug, category)}
                  onClick={() => setMenuOpen(false)}
                  key={category.id}
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <Link to={`/${tenantSlug}#contacto`} onClick={() => setMenuOpen(false)}>
              Contacto
            </Link>
          </nav>
        </div>
      ) : null}
      <AuthDialog
        key={auth ?? "closed"}
        open={auth !== null}
        onOpenChange={(open) => {
          if (!open) setAuth(null);
        }}
        initialView={auth ?? "login"}
        tenantSlug={tenantSlug}
        tenant={tenant}
      />
    </>
  );
};
