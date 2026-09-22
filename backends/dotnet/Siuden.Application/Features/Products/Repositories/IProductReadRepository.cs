using Siuden.Application.DTOs;
using Siuden.Application.Features.Products.DTOs;
using Siuden.Domain.Entities;
using Siuden.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Products.Repositories;

public interface IProductReadRepository : IAsyncRepository<Product, long>
{
    Task<PagedResult<ProductListItemDto>> GetPagedAsync(
        ProductSearchCriteria criteria,
        CancellationToken cancellationToken = default);

    Task<PagedResult<AdminProductListItemDto>> GetAdminPagedAsync(
        AdminProductSearchCriteria criteria,
        CancellationToken cancellationToken = default);

    Task<AdminProductDetailDto?> GetAdminByIdAsync(
        Guid tenantId,
        long productId,
        CancellationToken cancellationToken);

    Task<PublicProductDetailDto?> GetPublicBySlugAsync(
        string tenantSlug,
        string productSlug,
        CancellationToken cancellationToken);
}
