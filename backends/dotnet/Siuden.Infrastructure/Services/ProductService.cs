using Siuden.Application.Common.Exceptions;
using Siuden.Application.DTOs;
using Siuden.Application.Features.Products.Commands;
using Siuden.Application.Features.Products.DTOs;
using Siuden.Application.Features.Products.Repositories;
using Siuden.Application.Interfaces;
using Siuden.Domain.Entities;
using Siuden.Domain.Enums;
using Siuden.Domain.Repositories;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Siuden.Infrastructure.Services;

public class ProductService(
    IProductReadRepository productReadRepository,
    IProductRepository productRepository,
    ICategoryRepository categoryRepository) : IProductService
{
    public async Task<PagedResult<ProductListItemDto>> GetPagedAsync(
        ProductSearchCriteria productSearchCriteria, 
        CancellationToken cancellationToken = default)
    {
        return await productReadRepository.GetPagedAsync(productSearchCriteria, cancellationToken);
    }

    public async Task<PagedResult<AdminProductListItemDto>> GetAdminPagedAsync(
        AdminProductSearchCriteria criteria,
        CancellationToken cancellationToken = default)
    {
        return await productReadRepository.GetAdminPagedAsync(
            criteria,
            cancellationToken);
    }

    public Task<AdminProductDetailDto?> GetAdminByIdAsync(
        Guid tenantId,
        long productId,
        CancellationToken cancellationToken = default)
    {
        return productReadRepository.GetAdminByIdAsync(
            tenantId,
            productId,
            cancellationToken);
    }

    public async Task<long> CreateAsync(
        CreateProductData data,
        CancellationToken cancellationToken = default)
    {
        await EnsureCategoriesBelongToTenantAsync(
            data.TenantId,
            data.Categories.Select(item => item.CategoryId).ToArray(),
            cancellationToken);

        var slug = await GenerateUniqueSlugAsync(
            data.TenantId,
            data.Name,
            excludingProductId: null,
            cancellationToken);


        var product = new Product
        {
            TenantId = data.TenantId,
            Name = data.Name.Trim(),
            Description = data.Description.Trim(),
            Status = data.Status,
            Slug = slug,
            SeoTitle = data.SeoTitle?.Trim() ?? string.Empty,
            SeoDescription = data.SeoDescription?.Trim() ?? string.Empty
        };

        foreach (var variant in data.Variants)
        {
            product.ProductVariants.Add(new ProductVariant
            {
                VariantName = variant.VariantName,
                Sku = variant.Sku,
                BarCode = variant.BarCode,
                Stock = variant.Stock,
                Price = variant.Price,
                Cost = variant.Cost,
                WeightKg = variant.WeightKg,
                HeightCm = variant.HeightCm,
                WidthCm = variant.WidthCm,
                DepthCm = variant.DepthCm
            });
        }

        foreach (var category in data.Categories)
        {
            product.ProductCategories.Add(new ProductCategory
            {
                CategoryId = category.CategoryId,
                IsPrimary = category.IsPrimary,
                SortOrder = category.SortOrder
            });
        }

        await productRepository.AddAsync(
            product,
            cancellationToken);

        return product.Id;
    }

    public async Task ChangeStatusAsync(
        Guid tenantId,
        long productId,
        ProductStatusEnum status,
        CancellationToken cancellationToken)
    {
        var product = await productRepository.GetAggregateAsync(
            tenantId,
            productId,
            cancellationToken)
            ?? throw new NotFoundException("Product not found.");

        product.Status = status;

        await productRepository.UpdateAsync(product, cancellationToken);
    }

    public async Task<long> DuplicateAsync(
        Guid tenantId,
        long productId,
        CancellationToken cancellationToken)
    {
        var source = await productRepository.GetAggregateAsync(
            tenantId,
            productId,
            cancellationToken)
            ?? throw new NotFoundException("Product not found.");

        var slug = await GenerateUniqueSlugAsync(
             tenantId,
            $"{source.Slug}-copia",
            null,
            cancellationToken);

        var duplicate = new Product
        {
            TenantId = tenantId,
            Name = $"{source.Name} - Copia",
            Description = source.Description,
            Slug = slug,

            // importante
            Status = ProductStatusEnum.DRAFT,

            SeoTitle = source.SeoTitle,
            SeoDescription = source.SeoDescription
        };

        foreach (var variant in source.ProductVariants)
        {
            duplicate.ProductVariants.Add(
                new ProductVariant
                {
                    VariantName = variant.VariantName,
                    Sku = null,
                    BarCode = null,
                    Stock = variant.Stock,
                    Price = variant.Price,
                    Cost = variant.Cost,
                    WeightKg = variant.WeightKg,
                    HeightCm = variant.HeightCm,
                    WidthCm = variant.WidthCm,
                    DepthCm = variant.DepthCm
                });
        }

        foreach (var category in source.ProductCategories)
        {
            duplicate.ProductCategories.Add(
                new ProductCategory
                {
                    CategoryId = category.CategoryId,
                    IsPrimary = category.IsPrimary,
                    SortOrder = category.SortOrder
                });
        }

        await productRepository.AddAsync(
            duplicate,
            cancellationToken);

        return duplicate.Id;
    }

    private async Task<string> GenerateUniqueSlugAsync(
        Guid tenantId,
        string name,
        long? excludingProductId,
        CancellationToken cancellationToken)
    {
        var baseSlug = GenerateSlug(name);
        var slug = baseSlug;
        var suffix = 2;

        while (await productRepository.SlugExistsAsync(
            tenantId: tenantId,
            slug: slug,
            excludingProductId: excludingProductId,
            cancellationToken: cancellationToken))
        {
            slug = $"{baseSlug}-{suffix}";
            suffix++;
        }

        return slug;
    }

    private static string GenerateSlug(string value)
    {
        var normalized = value
            .Trim()
            .ToLowerInvariant()
            .Normalize(NormalizationForm.FormD);

        var chars = normalized
            .Where(c =>
                CharUnicodeInfo.GetUnicodeCategory(c) !=
                UnicodeCategory.NonSpacingMark)
            .ToArray();

        var slug = new string(chars)
            .Normalize(NormalizationForm.FormC);

        slug = Regex.Replace(
            slug,
            @"[^a-z0-9]+",
            "-");

        return slug.Trim('-');
    }

    public async Task UpdateAsync(long productId, UpdateProductData data, CancellationToken cancellationToken = default)
    {
        await EnsureCategoriesBelongToTenantAsync(
            data.TenantId,
            data.Categories.Select(item => item.CategoryId).ToArray(),
            cancellationToken);

        var product = await productRepository.GetAggregateAsync(
        data.TenantId,
        productId,
        cancellationToken)
        ?? throw new NotFoundException("Product not found.");

        // Product
        product.Name = data.Name.Trim();
        product.Description = data.Description.Trim();
        product.Status = data.Status;
        product.SeoTitle = data.SeoTitle?.Trim() ?? string.Empty;
        product.SeoDescription = data.SeoDescription?.Trim() ?? string.Empty;

        product.Slug = await GenerateUniqueSlugAsync(
            data.TenantId,
            data.Name,
            productId,
            cancellationToken);

        // -------------------------
        // Variants
        // -------------------------

        var incomingVariantIds = data.Variants
            .Where(x => x.Id.HasValue)
            .Select(x => x.Id!.Value)
            .ToHashSet();

        // Eliminar variantes que ya no vienen en el PUT
        var variantsToRemove = product.ProductVariants
            .Where(x => !incomingVariantIds.Contains(x.Id))
            .ToList();

        foreach (var variant in variantsToRemove)
        {
            product.ProductVariants.Remove(variant);
        }

        foreach (var variantData in data.Variants)
        {
            // Nueva variante
            if (!variantData.Id.HasValue)
            {
                product.ProductVariants.Add(
                    new ProductVariant
                    {
                        VariantName = variantData.VariantName,
                        Sku = variantData.Sku,
                        BarCode = variantData.BarCode,
                        Stock = variantData.Stock,
                        Price = variantData.Price,
                        Cost = variantData.Cost,
                        WeightKg = variantData.WeightKg,
                        HeightCm = variantData.HeightCm,
                        WidthCm = variantData.WidthCm,
                        DepthCm = variantData.DepthCm
                    });

                continue;
            }

            // Variante existente
            var variant = product.ProductVariants
                .FirstOrDefault(x =>
                    x.Id == variantData.Id.Value);

            if (variant is null)
            {
                throw new NotFoundException(
                    $"Product variant '{variantData.Id.Value}' not found.");
            }

            variant.VariantName = variantData.VariantName;
            variant.Sku = variantData.Sku;
            variant.BarCode = variantData.BarCode;
            variant.Stock = variantData.Stock;
            variant.Price = variantData.Price;
            variant.Cost = variantData.Cost;
            variant.WeightKg = variantData.WeightKg;
            variant.HeightCm = variantData.HeightCm;
            variant.WidthCm = variantData.WidthCm;
            variant.DepthCm = variantData.DepthCm;
        }

        // -------------------------
        // Categories
        // -------------------------

        var incomingCategoryIds = data.Categories
            .Select(x => x.CategoryId)
            .ToHashSet();

        // Eliminar categorías que ya no vienen
        var categoriesToRemove = product.ProductCategories
            .Where(x =>
                !incomingCategoryIds.Contains(x.CategoryId))
            .ToList();

        foreach (var category in categoriesToRemove)
        {
            product.ProductCategories.Remove(category);
        }

        foreach (var categoryData in data.Categories)
        {
            var category = product.ProductCategories
                .FirstOrDefault(x =>
                    x.CategoryId == categoryData.CategoryId);

            // Nueva categoría
            if (category is null)
            {
                product.ProductCategories.Add(
                    new ProductCategory
                    {
                        CategoryId = categoryData.CategoryId,
                        IsPrimary = categoryData.IsPrimary,
                        SortOrder = categoryData.SortOrder
                    });

                continue;
            }

            // Categoría existente
            category.IsPrimary = categoryData.IsPrimary;
            category.SortOrder = categoryData.SortOrder;
        }

        await productRepository.UpdateAsync(
            product,
            cancellationToken);
    }

    public async Task DeleteAsync(
        Guid tenantId,
        long productId,
        CancellationToken cancellationToken = default)
    {
        var product = await productRepository.GetAggregateAsync(
            tenantId,
            productId,
            cancellationToken)
            ?? throw new NotFoundException("Product not found.");

        await productRepository.DeleteAsync(
                product,
                cancellationToken);
    }

    private async Task EnsureCategoriesBelongToTenantAsync(
        Guid tenantId,
        IReadOnlyCollection<Guid> categoryIds,
        CancellationToken cancellationToken)
    {
        if (!await categoryRepository.AllBelongToTenantAsync(
                tenantId,
                categoryIds,
                cancellationToken))
        {
            throw new NotFoundException(
                "One or more product categories were not found.");
        }
    }
}
