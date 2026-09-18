import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Heart } from "lucide-react";

export const WhatsappBanner = () => {
  return (
    <section
      className="mx-auto w-[min(100%-2rem,86rem)] py-16 sm:py-20 lg:py-28"
      id="contacto"
    >
      <div className="relative overflow-hidden bg-[var(--store-primary)] px-6 py-12 text-white sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between lg:px-16 lg:py-20">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[.18em] text-white/75">
            <Heart className="size-5" /> Atención cercana
          </p>
          <h2 className="font-serif text-[clamp(2.5rem,5vw,4.7rem)] leading-[.96] tracking-[-.04em]">
            ¿Buscás una pieza especial?
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
            Contanos qué tenés en mente. Te ayudamos a encontrar una joya para
            regalar, celebrar o acompañarte todos los días.
          </p>
        </div>
        <a
          className={cn(
            buttonVariants({ variant: "light" }),
            "relative z-10 mt-9 lg:mt-0",
          )}
          href="https://wa.me/5493816776136"
          target="_blank"
          rel="noreferrer"
        >
          Escribinos por WhatsApp <ArrowRight className="size-4" />
        </a>
        <span className="absolute -right-14 -top-16 size-64 rounded-full border border-white/15" />
      </div>
    </section>
  );
};
