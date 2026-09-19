using Siuden.Application.Features.Products.DTOs;

namespace Siuden.Api.Contracts.Products;

public class GetProductsRequest
{
    public Guid? CategoryId { get; set; }
    public ProductSortBy SortBy { get; set; } = ProductSortBy.Newest;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}