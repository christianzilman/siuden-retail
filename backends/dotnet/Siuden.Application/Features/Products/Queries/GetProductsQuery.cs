using MediatR;
using Siuden.Application.DTOs;
using Siuden.Application.Features.Products.DTOs;

namespace Siuden.Application.Features.Products.Queries;

public record GetProductsQuery(
    string TenantSlug,
    Guid? CategoryId,
    ProductSortBy SortBy,
    int PageNumber,
    int PageSize
) : IRequest<PagedResult<ProductListItemDto>>;