using MediatR;
using Siuden.Application.DTOs;
using Siuden.Application.Features.Products.Commands;
using Siuden.Application.Features.Products.DTOs;
using Siuden.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Interfaces;

public interface IProductService
{
    Task<PagedResult<ProductListItemDto>> GetPagedAsync(
        ProductSearchCriteria productSearchCriteria, 
        CancellationToken cancellationToken = default);
    Task<PagedResult<AdminProductListItemDto>> GetAdminPagedAsync(
        AdminProductSearchCriteria criteria,
        CancellationToken cancellationToken = default);
    Task<long> CreateAsync(
        CreateProductData product,
        CancellationToken cancellationToken = default);
    Task ChangeStatusAsync(
        Guid tenantId,
        long productId,
        ProductStatusEnum status,
        CancellationToken cancellationToken);
    Task UpdateAsync(
        long productId,
        UpdateProductData data,
        CancellationToken cancellationToken = default);
    Task<long> DuplicateAsync(
        Guid tenantId,
        long productId,
        CancellationToken cancellationToken);
    Task DeleteAsync(
        Guid tenantId,
        long productId,
        CancellationToken cancellationToken = default);
}
