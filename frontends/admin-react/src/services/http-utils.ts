export type ApiPage<T> = {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export function page<T>(response: ApiPage<T>) {
  return {
    items: response.data,
    total: response.meta.total,
    page: response.meta.page,
    pageSize: response.meta.limit,
    totalPages: response.meta.totalPages,
  };
}

export function params(values: Record<string, unknown>): string {
  const result = new URLSearchParams();
  for (const [key, value] of Object.entries(values))
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "ALL"
    )
      result.set(key, String(value));
  const query = result.toString();
  return query ? `?${query}` : "";
}
