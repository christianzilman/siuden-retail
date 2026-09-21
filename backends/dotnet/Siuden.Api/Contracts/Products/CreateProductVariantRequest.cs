namespace Siuden.Api.Contracts.Products;

public class CreateProductVariantRequest
{
    public string VariantName { get; set; } = "Default";
    public string? Sku { get; set; }
    public string? BarCode { get; set; }
    public decimal Stock { get; set; }
    public decimal Price { get; set; }
    public decimal Cost { get; set; }
    public decimal? WeightKg { get; set; }
    public decimal? HeightCm { get; set; }
    public decimal? WidthCm { get; set; }
    public decimal? DepthCm { get; set; }
}
