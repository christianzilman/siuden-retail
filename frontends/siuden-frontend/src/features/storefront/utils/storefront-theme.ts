import type { CSSProperties } from "react";
import type { PublicTenant } from "@/features/catalog/types/catalog.types";

const defaultStorefrontTheme = {
  "--store-primary": "#74263A",
  "--store-secondary": "#312A2B",
  "--store-accent": "#B39155",
  "--store-background": "#F8F6F1",
  "--store-surface": "#FFFFFF",
  "--store-text": "#292526",
  "--store-muted": "#706869",
  "--store-hairline": "#E5DED4",
  "--store-heading-font": "Georgia, serif",
  "--store-body-font": "Georgia, serif",
  "--store-radius": "0.625rem",
} as CSSProperties;

export function getStorefrontTheme(tenant?: PublicTenant): CSSProperties {
  if (!tenant) return defaultStorefrontTheme;

  return {
    ...defaultStorefrontTheme,
    "--store-primary": tenant.primaryColor || "#74263A",
    "--store-secondary": tenant.secondaryColor || "#312A2B",
    "--store-background": tenant.backgroundColor || "#F8F6F1",
    "--store-text": tenant.textColor || "#292526",
    "--store-heading-font": tenant.headingFont || "Georgia, serif",
    "--store-body-font": tenant.bodyFont || "Georgia, serif",
    "--store-radius": tenant.borderRadius || "0.625rem",
    "--radius": tenant.borderRadius || "0.625rem",
  } as CSSProperties;
}

export function getWhatsappUrl(tenant?: PublicTenant) {
  const digits = tenant?.phone.replace(/\D/g, "") ?? "";
  const international = tenant?.countryCode === "AR" && digits.length === 10
    ? `549${digits}`
    : digits;
  return international ? `https://wa.me/${international}` : undefined;
}
