using Siuden.Api.Contracts.Common;
using Siuden.Application.Features.Products.DTOs;
using Siuden.Domain.Enums;

namespace Siuden.Api.Contracts.Products;

public class GetAdminProductsRequest
{
    public string? Name { get; set; }
    public string? Sku { get; set; }
    public Guid? CategoryId { get; set; }
    public ProductStatusEnum? Status { get; set; }
    public ProductStockFilter Stock { get; set; } = ProductStockFilter.All;
    public ProductSortBy SortBy { get; set; } = ProductSortBy.Newest;
    public PaginationRequest Paging { get; set; } = new();
}
