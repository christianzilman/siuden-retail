using MediatR;
using Siuden.Application.DTOs;
using Siuden.Application.Features.Products.DTOs;
using Siuden.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Products.Queries;

public record GetAdminProductsQuery(
    Guid TenantId,
    string? Name,
    string? Sku,
    Guid? CategoryId,
    ProductStatusEnum? Status,
    ProductStockFilter Stock,
    ProductSortBy SortBy,
    int PageNumber,
    int PageSize)
    : IRequest<PagedResult<AdminProductListItemDto>>;
