import type { ContactSettingsValues, StoreSettingsValues } from "@/features/settings/types/forms";
import type { StoreContactChannel } from "@/features/settings/types/settings";

export const DEFAULT_STORE_VALUES: StoreSettingsValues = {
  brandName: "",
  contactEmail: "",
  phone: "",
  addressLine: "",
  addressNumber: "",
  city: "",
  province: "",
  postalCode: "",
  primaryColor: "#74263A",
  secondaryColor: "#312A2B",
  backgroundColor: "#F8F6F1",
  textColor: "#292526",
  headingFont: "Merriweather",
  bodyFont: "Lora",
  borderRadius: "0rem",
  announcementEnabled: true,
  announcementText: "",
  announcementUrl: "",
  isPublished: true,
  showPrices: true,
  defaultCatalogSort: "FEATURED",
  catalogColumnsDesktop: 4,
};

export const DEFAULT_CONTACT_VALUES: ContactSettingsValues = {
  whatsapp: "",
  whatsappEnabled: false,
  instagram: "",
  instagramEnabled: false,
  facebook: "",
  facebookEnabled: false,
  contactFormEnabled: true,
};

export function nullable(value: string): string | null {
  const normalized = value.trim();
  return normalized || null;
}

export function isHexColor(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value);
}

export function argentinaLocalDigits(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("54")) digits = digits.slice(2);
  if (digits.startsWith("9") && digits.length === 11) digits = digits.slice(1);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

export function normalizeWhatsapp(value: string): { display: string; url: string | null } {
  const local = argentinaLocalDigits(value);
  if (!local) return { display: "", url: null };

  const areaCode = local.slice(0, 3);
  const first = local.slice(3, 6);
  const last = local.slice(6);
  return {
    display: `+54 9 ${areaCode} ${first}-${last}`,
    url: `https://wa.me/549${local}`,
  };
}

export function normalizeSocialHandle(value: string, network: "instagram" | "facebook"): string {
  const domain = network === "instagram" ? "instagram.com" : "facebook.com";
  return value
    .trim()
    .replace(new RegExp(`^(?:https?:\\/\\/)?(?:www\\.)?${domain.replace(".", "\\.")}\\/`, "i"), "")
    .replace(/^@/, "")
    .split(/[/?#]/, 1)[0]
    ?.trim() ?? "";
}

export function socialUrl(network: "instagram" | "facebook", handle: string): string | null {
  if (!handle) return null;
  return `https://www.${network}.com/${handle}`;
}

export function contactValue(
  contacts: StoreContactChannel[],
  channelType: "WHATSAPP" | "INSTAGRAM" | "FACEBOOK",
): string {
  return contacts.find((channel) => channel.channelType === channelType)?.value ?? "";
}
