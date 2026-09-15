import type { MediaAsset } from "@/types/common";

export type ServiceErrorCode =
  | "AUTH_REQUIRED"
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_UNAVAILABLE"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION"
  | "CONFLICT"
  | "INSUFFICIENT_STOCK"
  | "ALREADY_CANCELLED";

export interface PageInput {
  page?: number;
  pageSize?: number;
}

export interface UploadedMockAsset extends MediaAsset {
  transient: true;
}
