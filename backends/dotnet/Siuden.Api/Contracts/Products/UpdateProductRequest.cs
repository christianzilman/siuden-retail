using Siuden.Domain.Enums;

namespace Siuden.Api.Contracts.Products;

public class UpdateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ProductStatusEnum Status { get; set; }
    public string? SeoTitle { get; set; }
    public string? SeoDescription { get; set; }
    public ICollection<UpdateProductVariantRequest> Variants { get; set; } = [];
    public ICollection<ProductCategoryRequest> Categories { get; set; } = [];
}
