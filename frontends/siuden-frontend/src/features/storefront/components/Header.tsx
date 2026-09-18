import { AuthDialog } from "@/features/auth/components/AuthDialog";
import { products } from "@/features/catalog/data/mocks";
import { formatPrice } from "@/lib/format";
import { X, Search, Camera, Menu } from "lucide-react";
import { useMemo, useState } from "react";

export const Header = ({ tenantSlug }: { tenantSlug: string }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [auth, setAuth] = useState<"login" | "register" | null>(null);
  const results = useMemo(
    () =>
      products
        .filter((product) =>
          `${product.name} ${product.material}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .slice(0, 5),
    [query],
  );

  return (
    <>
      <div className="border-b border-[var(--store-hairline)] bg-white/80">
        <div className="mx-auto flex min-h-9 w-[min(100%-2rem,86rem)] items-center justify-end gap-2 text-xs text-[var(--store-muted)]">
          <button onClick={() => setAuth("register")}>Crear cuenta</button>
          <span>|</span>
          <button onClick={() => setAuth("login")}>Iniciar sesión</button>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-[var(--store-hairline)] bg-[color:rgb(248_246_241_/_0.94)] backdrop-blur-md">
        <div className="mx-auto flex h-20 w-[min(100%-2rem,86rem)] items-center justify-between gap-5 lg:h-24">
          <a className="flex items-center gap-3" href="#inicio">
            <span className="grid size-9 place-items-center rounded-full border border-[var(--store-accent)] font-serif text-xl italic text-[var(--store-primary)]">
              R
            </span>
            <span className="font-serif text-3xl tracking-[.08em]">Rubí</span>
          </a>
          <nav className="hidden items-center gap-9 text-sm lg:flex">
            <a href="#inicio">Inicio</a>
            <a href="#productos">Productos</a>
            <a href="#categorias">Categorías</a>
            <a href="#contacto">Contacto</a>
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
                  <a
                    className="flex justify-between border-b py-3 text-sm"
                    href={`#producto-${product.id}`}
                    key={product.id}
                    onClick={() => setSearchOpen(false)}
                  >
                    <span>
                      {product.name}
                      <small className="block text-[var(--store-muted)]">
                        {product.material}
                      </small>
                    </span>
                    <span>{formatPrice(product.price)}</span>
                  </a>
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
            <a href="#inicio" onClick={() => setMenuOpen(false)}>
              Inicio
            </a>
            <a href="#productos" onClick={() => setMenuOpen(false)}>
              Productos
            </a>
            <a href="#categorias" onClick={() => setMenuOpen(false)}>
              Categorías
            </a>
            <a href="#contacto" onClick={() => setMenuOpen(false)}>
              Contacto
            </a>
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
      />
    </>
  );
};
