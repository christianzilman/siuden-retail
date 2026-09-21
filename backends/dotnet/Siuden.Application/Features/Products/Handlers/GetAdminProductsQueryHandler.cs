using MediatR;
using Siuden.Application.DTOs;
using Siuden.Application.Features.Products.DTOs;
using Siuden.Application.Features.Products.Queries;
using Siuden.Application.Interfaces;

namespace Siuden.Application.Features.Products.Handlers;

public class GetAdminProductsQueryHandler(
    IProductService productService)
    : IRequestHandler<
        GetAdminProductsQuery,
        PagedResult<AdminProductListItemDto>>
{
    public async Task<PagedResult<AdminProductListItemDto>> Handle(
        GetAdminProductsQuery request,
        CancellationToken cancellationToken)
    {
        var criteria = new AdminProductSearchCriteria(
            request.TenantId,
            request.Name,
            request.Sku,
            request.CategoryId,
            request.Status,
            request.Stock,
            request.SortBy,
            request.PageNumber,
            request.PageSize);

        return await productService.GetAdminPagedAsync(
            criteria,
            cancellationToken);
    }
}
