

export interface StoreProfile {
  tenantId: string;
  brandName: string;
  contactEmail: string | null;
  phone: string | null;
  addressLine: string | null;
  addressNumber: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  countryCode: string;
}

export type DefaultCatalogSort = "FEATURED" | "NEWEST" | "PRICE_ASC" | "PRICE_DESC" | "NAME_ASC";

export interface StorefrontSettings {
  tenantId: string;
  isPublished: boolean;
  contactFormEnabled: boolean;
  showPrices: boolean;
  allowNegativeStock: boolean;
  defaultCatalogSort: DefaultCatalogSort;
  catalogColumnsDesktop: number;
}

export interface StoreTheme {
  tenantId: string;
  logoAssetId: string | null;
  faviconAssetId: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  borderRadius: string;
  announcementEnabled: boolean;
  announcementText: string | null;
  announcementUrl: string | null;
}

export type StoreContactChannelType = "WHATSAPP" | "FACEBOOK" | "INSTAGRAM" | "MESSENGER" | "EMAIL" | "OTHER";

export interface StoreContactChannel {
  id: string;
  tenantId: string;
  channelType: StoreContactChannelType;
  value: string | null;
  url: string | null;
  enabled: boolean;
  sortOrder: number;
}
