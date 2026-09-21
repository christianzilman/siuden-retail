using Siuden.Domain.Enums;

namespace Siuden.Application.Features.Products.DTOs;

public class AdminProductListItemDto
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public ProductStatusEnum Status { get; set; }
    public string? Sku { get; set; }
    public decimal Price { get; set; }
    public decimal Stock { get; set; }
    public int VariantCount { get; set; }
    public string? ImageUrl { get; set; }
    public string? CategoryName { get; set; }
    public DateTime CreatedAt { get; set; }
}
