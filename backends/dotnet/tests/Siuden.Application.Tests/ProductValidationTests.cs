using Siuden.Application.Features.Products.Commands;
using Siuden.Application.Features.Products.DTOs;
using Siuden.Application.Features.Products.Queries;
using Siuden.Application.Validators.Products;
using Siuden.Domain.Enums;
using Xunit;

namespace Siuden.Application.Tests;

public sealed class ProductValidationTests
{
    [Fact]
    public async Task CreateRejectsRepeatedCategories()
    {
        var categoryId = Guid.NewGuid();
        var command = new CreateProductCommand(new CreateProductData(
            Guid.NewGuid(),
            "Anillo Rubí",
            "Descripción",
            ProductStatusEnum.DRAFT,
            null,
            null,
            [new CreateProductVariantItem(
                "Default", null, null, 1, 100, 50, null, null, null, null)],
            [
                new CreateProductCategoryItem(categoryId, true, 0),
                new CreateProductCategoryItem(categoryId, false, 1)
            ]));

        var result = await new CreateProductCommandValidator()
            .ValidateAsync(command);

        Assert.False(result.IsValid);
        Assert.Contains(
            result.Errors,
            error => error.PropertyName == "Product.Categories");
    }

    [Fact]
    public async Task AdminListRejectsMissingTenantAndInvalidPaging()
    {
        var query = new GetAdminProductsQuery(
            Guid.Empty,
            null,
            null,
            null,
            null,
            ProductStockFilter.All,
            ProductSortBy.Newest,
            0,
            101);

        var result = await new GetAdminProductsQueryValidator()
            .ValidateAsync(query);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == "TenantId");
        Assert.Contains(result.Errors, error => error.PropertyName == "PageNumber");
        Assert.Contains(result.Errors, error => error.PropertyName == "PageSize");
    }
}
