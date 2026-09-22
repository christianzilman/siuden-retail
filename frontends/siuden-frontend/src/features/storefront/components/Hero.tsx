import { buttonVariants } from "@/components/ui/button";
import { HERO_IMAGE } from "@/features/catalog/data/storefront-content";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { PublicTenant } from "@/features/catalog/types/catalog.types";
import { getWhatsappUrl } from "../utils/storefront-theme";

export const Hero = ({ tenant, tenantName, tenantSlug }: { tenant?: PublicTenant; tenantName: string; tenantSlug: string }) => {
  const whatsappUrl = getWhatsappUrl(tenant);
  return (
    <section
      className="mx-auto w-[min(100%-2rem,86rem)] scroll-mt-32 py-5 sm:py-8 lg:py-12"
      id="inicio"
    >
      <div className="grid overflow-hidden bg-white lg:grid-cols-[minmax(24rem,.9fr)_minmax(0,1.25fr)]">
        <div className="relative z-10 flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:-mr-16 lg:px-14 xl:-mr-24 xl:px-16">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[var(--store-primary)]">
            Selección {tenantName} · Tucumán
          </p>
          <h1 className="mt-5 max-w-[11ch] font-serif text-[clamp(3rem,6vw,6.5rem)] font-normal leading-[.9] tracking-[-.05em]">
            Joyas que acompañan tu historia
          </h1>
          <p className="mt-7 max-w-lg text-base leading-8 text-[var(--store-muted)] sm:text-lg">
            Piezas elegidas con dedicación y una atención cercana para ayudarte
            a encontrar eso que querés recordar siempre.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link className={buttonVariants()} to={`/${tenantSlug}/productos`}>
              Ver colección <ArrowRight className="size-4" />
            </Link>
            {whatsappUrl ? <a
              className={buttonVariants({ variant: "secondary" })}
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              Consultar por WhatsApp
            </a> : null}
          </div>
          <div className="mt-10 flex items-center gap-3 text-xs uppercase tracking-[.18em] text-[var(--store-muted)]">
            <span className="h-px w-9 bg-[var(--store-accent)]" /> Atención
            personalizada
          </div>
        </div>
        <figure className="relative min-h-104 overflow-hidden sm:min-h-136 lg:min-h-172">
          <img
            className="absolute inset-0 size-full object-cover lg:object-[58%_center]"
            src={HERO_IMAGE}
            alt="Collar y aros dorados con piedras color rubí sobre una base clara"
          />
          <figcaption className="absolute bottom-6 right-6 bg-white/90 px-4 py-2 text-xs uppercase tracking-[.18em]">
            Curaduría · {tenantName}
          </figcaption>
        </figure>
      </div>
    </section>
  );
};
