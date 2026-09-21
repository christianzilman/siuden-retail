namespace Siuden.Api.Contracts.Products;

public class ProductCategoryRequest
{
    public Guid CategoryId { get; set; }
    public bool IsPrimary { get; set; }
    public int SortOrder { get; set; }
}
