using MediatR;
using Siuden.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Products.Commands;

public record CreateProductCommand(
    CreateProductData Product)
    : IRequest<long>;

public record CreateProductData(
    Guid TenantId,
    string Name,
    string Description,
    ProductStatusEnum Status,
    string? SeoTitle,
    string? SeoDescription,
    ICollection<CreateProductVariantItem> Variants,
    ICollection<CreateProductCategoryItem> Categories);

public record CreateProductVariantItem(
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


public record CreateProductCategoryItem(
    Guid CategoryId,
    bool IsPrimary,
    int SortOrder);