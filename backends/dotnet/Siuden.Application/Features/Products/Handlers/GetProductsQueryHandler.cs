using MediatR;
using Siuden.Application.DTOs;
using Siuden.Application.Features.Products.DTOs;
using Siuden.Application.Features.Products.Queries;
using Siuden.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Products.Handlers;

public class GetProductsQueryHandler(IProductService productService) : IRequestHandler<GetProductsQuery, PagedResult<ProductListItemDto>>
{
    public async Task<PagedResult<ProductListItemDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var criteria = new ProductSearchCriteria(
            request.TenantSlug,
            request.CategoryId,
            request.SortBy,
            request.PageNumber,
            request.PageSize);

        return await productService.GetPagedAsync(
            criteria,
            cancellationToken);
    }
}
