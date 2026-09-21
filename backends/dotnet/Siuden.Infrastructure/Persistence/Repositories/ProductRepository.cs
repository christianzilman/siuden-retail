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

public class ProductRepository : RepositoryBase<Product, long> , IProductRepository
{
    public ProductRepository(SiudenRetailDbContext context) : base(context)
    {
    }

    public async Task<Product?> GetAggregateAsync(Guid tenantId, long productId, CancellationToken cancellationToken)
    {
        return await Context.Products
            .Include(x => x.ProductVariants)
            .Include(x => x.ProductCategories)
            .Include(x => x.ProductImages)
            .FirstOrDefaultAsync(
                x =>
                    x.Id == productId &&
                    x.TenantId == tenantId,
                cancellationToken);
    }

    public async Task<bool> SlugExistsAsync(Guid tenantId, string slug, long? excludingProductId, CancellationToken cancellationToken)
    {
        return await Context.Products
            .AsNoTracking()
            .AnyAsync(
                x =>
                    x.TenantId == tenantId &&
                    x.Slug == slug &&
                    (!excludingProductId.HasValue ||
                    x.Id != excludingProductId.Value),
                cancellationToken);
    }
}
