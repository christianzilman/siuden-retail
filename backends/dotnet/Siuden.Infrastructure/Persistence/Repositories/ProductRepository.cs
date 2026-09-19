using MapsterMapper;
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

public class ProductRepository : RepositoryBase<Product, long> ,IProductRepository, IProductReadRepository
{
    public ProductRepository(SiudenRetailDbContext context) : base(context)
    {
    }
    public async Task<PagedResult<ProductListItemDto>> GetPagedAsync(ProductSearchCriteria criteria, CancellationToken cancellationToken = default)
    {
        var query = Context.Products
        .AsNoTracking()
        .ApplyFilter(criteria);

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
}
