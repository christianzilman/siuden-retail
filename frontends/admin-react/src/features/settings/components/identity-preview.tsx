import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StoreSettingsValues } from "@/features/settings/types/forms";
import { isHexColor } from "@/features/settings/utils/settings-helpers";
import { type CSSProperties } from "react";

export function IdentityPreview({ values }: { values: StoreSettingsValues }) {
  const primaryColor = isHexColor(values.primaryColor) ? values.primaryColor : "#74263A";
  const secondaryColor = isHexColor(values.secondaryColor) ? values.secondaryColor : "#312A2B";
  const backgroundColor = isHexColor(values.backgroundColor) ? values.backgroundColor : "#F8F6F1";
  const textColor = isHexColor(values.textColor) ? values.textColor : "#292526";
  const columnCount = Math.min(4, Math.max(2, values.catalogColumnsDesktop));

  return (
    <Card className="overflow-hidden xl:sticky xl:top-6">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Vista previa de identidad</CardTitle>
            <CardDescription className="mt-1">Se actualiza mientras editás.</CardDescription>
          </div>
          <span
            className="rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ backgroundColor: `${primaryColor}18`, color: primaryColor }}
          >
            {values.isPublished ? "Publicada" : "Oculta"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        <div
          className="overflow-hidden border shadow-sm"
          style={
            {
              backgroundColor,
              borderColor: `${secondaryColor}24`,
              borderRadius: values.borderRadius,
              color: textColor,
              fontFamily: values.bodyFont,
            } as CSSProperties
          }
        >
          {values.announcementEnabled ? (
            <div className="px-4 py-2 text-center text-[11px] font-semibold text-white" style={{ backgroundColor: primaryColor }}>
              {values.announcementText || "Tu mensaje destacado"}
            </div>
          ) : null}
          <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: `${secondaryColor}20` }}>
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: primaryColor }}>
                {(values.brandName || "R").slice(0, 1).toUpperCase()}
              </span>
              <span className="text-sm font-semibold" style={{ fontFamily: values.headingFont }}>
                {values.brandName || "Tu comercio"}
              </span>
            </div>
            <span className="text-[10px] font-medium opacity-65">Inicio · Productos · Contacto</span>
          </div>
          <div className="grid gap-4 p-4 sm:grid-cols-[1.2fr_.8fr]">
            <div className="flex flex-col justify-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: primaryColor }}>
                Selección Rubí
              </p>
              <p className="mt-2 text-xl font-semibold leading-tight" style={{ fontFamily: values.headingFont }}>
                Joyas que acompañan tu historia
              </p>
              <p className="mt-2 text-xs leading-5 opacity-70">
                Una identidad cálida, elegante y cercana para tu catálogo.
              </p>
              <span className="mt-3 w-fit rounded-md px-3 py-1.5 text-[11px] font-semibold text-white" style={{ backgroundColor: primaryColor }}>
                Ver colección
              </span>
            </div>
            <img
              src="/images/tenants/rubi/hero/coleccion-rubi.webp"
              alt=""
              className="h-32 w-full rounded-md object-cover"
            />
          </div>
          <div className="border-t px-4 py-3" style={{ borderColor: `${secondaryColor}20` }}>
            <div className="mb-2 flex items-center justify-between text-[10px] font-semibold">
              <span>Catálogo</span>
              <span className="font-normal opacity-60">{columnCount} columnas</span>
            </div>
            <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>
              {Array.from({ length: columnCount }, (_, index) => (
                <div key={index} className="space-y-1">
                  <div className="aspect-square rounded-sm" style={{ backgroundColor: `${primaryColor}${index % 2 === 0 ? "20" : "10"}` }} />
                  {values.showPrices ? <div className="h-1.5 w-2/3 rounded bg-current opacity-25" /> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
