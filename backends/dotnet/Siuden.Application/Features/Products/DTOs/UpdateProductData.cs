using Siuden.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Products.DTOs;

public record UpdateProductData(
    Guid TenantId,
    string Name,
    string Description,
    ProductStatusEnum Status,
    string? SeoTitle,
    string? SeoDescription,
    ICollection<UpdateProductVariantItem> Variants,
    ICollection<UpdateProductCategoryItem> Categories);


public record UpdateProductVariantItem(
    long? Id,
    string VariantName,
    string? Sku,
    string? BarCode,
    decimal Stock,
    decimal Price,
    decimal Cost,
    decimal? WeightKg,
    decimal? HeightCm,
    decimal? WidthCm,
    decimal? DepthCm);

public record UpdateProductCategoryItem(
    Guid CategoryId,
    bool IsPrimary,
    int SortOrder);
