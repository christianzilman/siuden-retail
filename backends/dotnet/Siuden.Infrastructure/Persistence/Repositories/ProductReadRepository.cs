using Microsoft.EntityFrameworkCore;
using Siuden.Application.DTOs;
using Siuden.Application.Features.Products.DTOs;
using Siuden.Application.Features.Products.Repositories;
using Siuden.Domain.Entities;
using Siuden.Domain.Repositories;
using Siuden.Infrastructure.Persistence.Repositories.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Infrastructure.Persistence.Repositories;

public class ProductReadRepository : RepositoryBase<Product, long>, IProductReadRepository
{
    public ProductReadRepository(SiudenRetailDbContext context) : base(context)
    {
    }

    public async Task<PagedResult<ProductListItemDto>> GetPagedAsync(
        ProductSearchCriteria criteria,
        CancellationToken cancellationToken = default)
    {
        var query = Context.Products
        .AsNoTracking()
        .ApplyStorefrontFilter(criteria);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .ApplySorting(criteria.SortBy)
            .ApplyPagination(
                criteria.PageNumber,
                criteria.PageSize)
            .Select(x => new ProductListItemDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Slug = x.Slug,
                Price = x.ProductVariants
                    .Min(v => v.Price),
                Stock = x.ProductVariants
                    .Sum(v => v.Stock),
                ImageUrl = x.ProductImages
                    .Where(i => i.IsPrimary)
                    .OrderBy(i => i.SortOrder)
                    .Select(i => i.Url)
                    .FirstOrDefault(),

                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return new PagedResult<ProductListItemDto>(
            items,
            criteria.PageNumber,
            criteria.PageSize,
            totalCount);
    }

    public async Task<PagedResult<AdminProductListItemDto>> GetAdminPagedAsync(
        AdminProductSearchCriteria criteria,
        CancellationToken cancellationToken = default)
    {
        var query = Context.Products
            .AsNoTracking()
            .ApplyAdminFilter(criteria);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .ApplySorting(criteria.SortBy)
            .ApplyPagination(
                criteria.PageNumber,
                criteria.PageSize)
            .Select(x => new AdminProductListItemDto
            {
                Id = x.Id,
                Name = x.Name,
                Slug = x.Slug,
                Status = x.Status,
                Price = x.ProductVariants
                    .Select(v => (decimal?)v.Price)
                    .Min() ?? 0,
                Stock = x.ProductVariants
                    .Sum(v => v.Stock),
                Sku = x.ProductVariants
                    .OrderBy(v => v.Id)
                    .Select(v => v.Sku)
                    .FirstOrDefault(),
                VariantCount = x.ProductVariants.Count,
                ImageUrl = x.ProductImages
                    .Where(i => i.IsPrimary)
                    .OrderBy(i => i.SortOrder)
                    .Select(i => i.Url)
                    .FirstOrDefault(),
                CategoryName = x.ProductCategories
                    .Where(pc => pc.IsPrimary)
                    .Select(pc => pc.Category.Name)
                    .FirstOrDefault(),
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return new PagedResult<AdminProductListItemDto>(
            items,
            criteria.PageNumber,
            criteria.PageSize,
            totalCount);
    }

    public async Task<AdminProductDetailDto?> GetAdminByIdAsync(
        Guid tenantId,
        long productId,
        CancellationToken cancellationToken)
    {
        return await Context.Products
            .AsNoTracking()
            .Where(x =>
                x.Id == productId &&
                x.TenantId == tenantId)
            .Select(x => new AdminProductDetailDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Slug = x.Slug,
                Status = x.Status,
                SeoTitle = x.SeoTitle,
                SeoDescription = x.SeoDescription,
                Variants = x.ProductVariants
                    .OrderBy(v => v.Id)
                    .Select(v => new ProductVariantDto
                    {
                        Id = v.Id,
                        VariantName = v.VariantName,
                        Sku = v.Sku,
                        BarCode = v.BarCode,
                        Stock = v.Stock,
                        Price = v.Price,
                        Cost = v.Cost,
                        WeightKg = v.WeightKg,
                        HeightCm = v.HeightCm,
                        WidthCm = v.WidthCm,
                        DepthCm = v.DepthCm
                    })
                    .ToList(),
                Categories = x.ProductCategories
                    .OrderBy(pc => pc.SortOrder)
                    .Select(pc => new ProductCategoryDto
                    {
                        CategoryId = pc.CategoryId,
                        Name = pc.Category.Name,
                        IsPrimary = pc.IsPrimary,
                        SortOrder = pc.SortOrder
                    })
                    .ToList(),
                Images = x.ProductImages
                    .OrderBy(i => i.SortOrder)
                    .Select(i => new ProductImageDto
                    {
                        Id = i.Id,
                        Url = i.Url,
                        IsPrimary = i.IsPrimary,
                        SortOrder = i.SortOrder
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<PublicProductDetailDto?> GetPublicBySlugAsync(
        string tenantSlug,
        string productSlug,
        CancellationToken cancellationToken)
    {
        return await Context.Products
            .AsNoTracking()
            .Where(x =>
                x.Tenant.Slug == tenantSlug &&
                x.Slug == productSlug &&
                x.Status == Siuden.Domain.Enums.ProductStatusEnum.PUBLISHED &&
                x.ProductVariants.Any())
            .Select(x => new PublicProductDetailDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Slug = x.Slug,
                SeoTitle = x.SeoTitle,
                SeoDescription = x.SeoDescription,
                Variants = x.ProductVariants
                    .OrderBy(v => v.Id)
                    .Select(v => new PublicProductVariantDto
                    {
                        Id = v.Id,
                        VariantName = v.VariantName,
                        Sku = v.Sku,
                        Stock = v.Stock,
                        Price = v.Price
                    })
                    .ToList(),
                Categories = x.ProductCategories
                    .OrderBy(pc => pc.SortOrder)
                    .Select(pc => new PublicProductCategoryDto
                    {
                        CategoryId = pc.CategoryId,
                        Name = pc.Category.Name,
                        Slug = pc.Category.Slug,
                        IsPrimary = pc.IsPrimary,
                        SortOrder = pc.SortOrder
                    })
                    .ToList(),
                Images = x.ProductImages
                    .OrderBy(i => i.SortOrder)
                    .Select(i => new ProductImageDto
                    {
                        Id = i.Id,
                        Url = i.Url,
                        IsPrimary = i.IsPrimary,
                        SortOrder = i.SortOrder
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
