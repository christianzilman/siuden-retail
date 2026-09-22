import type { Category, PublicTenant } from "@/features/catalog/types/catalog.types";
import {
  categoryProductsHref,
  flattenCategories,
} from "@/features/catalog/utils/catalog.utils";
import { Camera, MapPin, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { getWhatsappUrl } from "../utils/storefront-theme";

interface FooterProps {
  categories: Category[];
  tenantName: string;
  tenantSlug: string;
  tenant?: PublicTenant;
}

export const Footer = ({ categories, tenant, tenantName, tenantSlug }: FooterProps) => {
  const whatsappUrl = getWhatsappUrl(tenant);
  const street = [tenant?.addressLine, tenant?.addressNumber]
    .filter(Boolean)
    .join(" ");
  const address = [street, tenant?.city, tenant?.province]
    .filter(Boolean)
    .join(", ");
  return (
    <footer className="bg-[var(--store-secondary)] text-white">
      <div className="mx-auto grid w-[min(100%-2rem,86rem)] gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_.8fr_.8fr_1.2fr] lg:py-20">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full border border-[var(--store-accent)] font-serif text-xl italic">
              {tenantName.trim().charAt(0).toLocaleUpperCase("es") || "S"}
            </span>
            <span className="font-serif text-3xl tracking-[.08em]">{tenantName}</span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-6 text-white/65">
            Joyas seleccionadas y atención personalizada desde San Miguel de
            Tucumán.
          </p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[.16em]">
            Navegación
          </h2>
          <nav className="mt-5 flex flex-col gap-3 text-sm text-white/70">
            <Link to={`/${tenantSlug}#inicio`}>Inicio</Link>
            <Link to={`/${tenantSlug}/productos#catalogo`}>Productos</Link>
            <Link to={`/${tenantSlug}#novedades`}>Novedades</Link>
            <Link to={`/${tenantSlug}#contacto`}>Contacto</Link>
          </nav>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[.16em]">
            Categorías
          </h2>
          <nav className="mt-5 flex flex-col gap-3 text-sm text-white/70">
            {flattenCategories(categories).slice(0, 5).map((category) => (
              <Link
                to={categoryProductsHref(tenantSlug, category)}
                key={category.id}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[.16em]">
            Encontranos
          </h2>
          {address ? (
            <p className="mt-5 flex gap-3 text-sm leading-6 text-white/70">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--store-accent)]" />{" "}
              {address}
            </p>
          ) : null}
          <div className="mt-6 flex gap-3">
            <a
              className="grid size-11 place-items-center rounded-full border border-white/25"
              href="https://www.instagram.com/rubijoyerias"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <Camera className="size-5" />
            </a>
            {whatsappUrl ? (
              <a
              className="grid size-11 place-items-center rounded-full border border-white/25"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
            >
              <MessageCircle className="size-5" />
              </a>
            ) : null}
          </div>
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/70">
            <a href="https://www.facebook.com/rubijoyerias">Facebook</a>
            <a href="https://www.tiktok.com/@rubijoyerias">@rubijoyerias</a>
            {tenant?.contactEmail ? (
              <a href={`mailto:${tenant.contactEmail}`}>{tenant.contactEmail}</a>
            ) : null}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-[min(100%-2rem,86rem)] flex-col gap-2 py-5 text-xs text-white/50 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {tenantName}. Todos los derechos
            reservados.
          </p>
          <p>
            Información comercial y canales de contacto sujetos a confirmación.
          </p>
        </div>
      </div>
    </footer>
  );
};
