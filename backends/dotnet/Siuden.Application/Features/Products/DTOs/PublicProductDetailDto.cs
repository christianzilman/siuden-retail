namespace Siuden.Application.Features.Products.DTOs;

public sealed class PublicProductDetailDto
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string? SeoTitle { get; set; }
    public string? SeoDescription { get; set; }
    public ICollection<PublicProductVariantDto> Variants { get; set; } = [];
    public ICollection<PublicProductCategoryDto> Categories { get; set; } = [];
    public ICollection<ProductImageDto> Images { get; set; } = [];
}

public sealed class PublicProductVariantDto
{
    public long Id { get; set; }
    public string VariantName { get; set; } = string.Empty;
    public string? Sku { get; set; }
    public decimal Stock { get; set; }
    public decimal Price { get; set; }
}

public sealed class PublicProductCategoryDto
{
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
    public int SortOrder { get; set; }
}
