using Siuden.Application.Features.Products.DTOs;
using Siuden.Domain.Entities;
using Siuden.Domain.Enums;

namespace Siuden.Infrastructure.Persistence.Repositories.Extensions;

public static class ProductQueryExtensions
{
    public static IQueryable<Product> ApplyFilter(
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
}