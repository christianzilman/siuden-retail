using Siuden.Application.Features.Products.DTOs;
using Siuden.Domain.Entities;
using Siuden.Domain.Enums;

namespace Siuden.Infrastructure.Persistence.Repositories.Extensions;

public static class ProductQueryExtensions
{
    public static IQueryable<Product> ApplyStorefrontFilter(
    this IQueryable<Product> query,
    ProductSearchCriteria criteria)
    {
        query = query.Where(x =>
            x.Tenant.Slug == criteria.TenantSlug &&
            x.Status == ProductStatusEnum.PUBLISHED &&
            x.ProductVariants.Any());

        if (criteria.CategoryId.HasValue)
        {
            query = query.Where(x =>
                x.ProductCategories.Any(pc =>
                    pc.CategoryId == criteria.CategoryId.Value));
        }

        return query;
    }

    public static IQueryable<Product> ApplySorting(
        this IQueryable<Product> query,
        ProductSortBy sortBy)
    {
        return sortBy switch
        {
            ProductSortBy.Newest =>
                query.OrderByDescending(x => x.CreatedAt),

            ProductSortBy.Oldest =>
                query.OrderBy(x => x.CreatedAt),

            ProductSortBy.PriceAsc =>
                query.OrderBy(x => x.ProductVariants
                    .Min(v => v.Price)),

            ProductSortBy.PriceDesc =>
                query.OrderByDescending(x => x.ProductVariants
                    .Min(v => v.Price)),

            ProductSortBy.NameAsc =>
            query.OrderBy(x => x.Name),

            ProductSortBy.NameDesc =>
                query.OrderByDescending(x => x.Name),

            _ =>
                query.OrderByDescending(x => x.CreatedAt)
        };
    }

    public static IQueryable<T> ApplyPagination<T>(
        this IQueryable<T> query,
        int pageNumber,
        int pageSize)
    {
        return query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize);
    }

    public static IQueryable<Product> ApplyAdminFilter(
    this IQueryable<Product> query,
    AdminProductSearchCriteria criteria)
    {
        query = query.Where(x =>
            x.TenantId == criteria.TenantId);

        if (!string.IsNullOrWhiteSpace(criteria.Name))
        {
            var name = criteria.Name.Trim();

            query = query.Where(x =>
                x.Name.Contains(name));
        }

        if (!string.IsNullOrWhiteSpace(criteria.Sku))
        {
            var sku = criteria.Sku.Trim();

            query = query.Where(x =>
                x.ProductVariants.Any(v =>
                    v.Sku != null &&
                    v.Sku.Contains(sku)));
        }

        if (criteria.CategoryId.HasValue)
        {
            query = query.Where(x =>
                x.ProductCategories.Any(pc =>
                    pc.CategoryId == criteria.CategoryId.Value));
        }

        if (criteria.Status.HasValue)
        {
            query = query.Where(x =>
                x.Status == criteria.Status.Value);
        }

        query = criteria.Stock switch
        {
            ProductStockFilter.InStock =>
                query.Where(x =>
                    x.ProductVariants.Any(v => v.Stock > 0)),

            ProductStockFilter.OutOfStock =>
                query.Where(x =>
                    x.ProductVariants.All(v => v.Stock <= 0)),

            _ => query
        };

        return query;
    }
}