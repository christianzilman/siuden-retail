

export type ISODateString = string;

export interface MediaAsset {
  id: string;
  tenantId: string;
  storageKey: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  altText: string | null;
  checksumSha256: string | null;
  status: "ACTIVE" | "DELETED";
  url: string;
  createdAt: ISODateString;
  deletedAt: ISODateString | null;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
