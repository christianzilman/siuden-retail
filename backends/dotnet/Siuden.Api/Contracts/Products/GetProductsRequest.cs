using Siuden.Api.Contracts.Common;
using Siuden.Application.Features.Products.DTOs;

namespace Siuden.Api.Contracts.Products;

public class GetProductsRequest
{
    public Guid? CategoryId { get; set; }
    public ProductSortBy SortBy { get; set; } = ProductSortBy.Newest;
    public PaginationRequest Paging { get; set; } = new();
}
