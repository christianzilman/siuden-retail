import { PaginationDto } from '../dto/pagination.dto';

export function paginationArgs(query: PaginationDto): {
  skip: number;
  take: number;
} {
  return { skip: (query.page - 1) * query.limit, take: query.limit };
}

export function paginated<T>(data: T[], total: number, query: PaginationDto) {
  return {
    data,
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}
