import type { ProductImage } from "@/features/products/types/products";
import type { DefaultCatalogSort, StoreContactChannel, StoreContactChannelType, StoreProfile, StoreTheme, StorefrontSettings } from "@/features/settings/types/settings";

export type UpdateStoreProfileInput = Omit<StoreProfile, "tenantId">;

export type UpdateStorefrontSettingsInput = Omit<StorefrontSettings, "tenantId">;

export type UpdateStoreThemeInput = Omit<StoreTheme, "tenantId" | "logoUrl" | "faviconUrl">;

export type StoreContactChannelInput = Omit<StoreContactChannel, "id" | "tenantId"> & { id?: string };

export interface StoreService {
  getProfile(): Promise<StoreProfile>;
  updateProfile(input: UpdateStoreProfileInput): Promise<StoreProfile>;
  getSettings(): Promise<StorefrontSettings>;
  updateSettings(input: UpdateStorefrontSettingsInput): Promise<StorefrontSettings>;
  getTheme(): Promise<StoreTheme>;
  updateTheme(input: UpdateStoreThemeInput): Promise<StoreTheme>;
  getContactChannels(): Promise<StoreContactChannel[]>;
  updateContactChannels(input: StoreContactChannelInput[]): Promise<StoreContactChannel[]>;
}

export interface StorePreviewOptions {
  catalogSort: DefaultCatalogSort;
  primaryImage?: ProductImage;
  contactChannel?: StoreContactChannelType;
}
