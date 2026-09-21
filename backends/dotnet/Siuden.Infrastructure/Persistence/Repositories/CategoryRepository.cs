using Microsoft.EntityFrameworkCore;
using Siuden.Domain.Entities;
using Siuden.Domain.Repositories;

namespace Siuden.Infrastructure.Persistence.Repositories;

public class CategoryRepository : RepositoryBase<Category, Guid>, ICategoryRepository
{
    public CategoryRepository(SiudenRetailDbContext context) : base(context)
    {
    }

    public async Task<IReadOnlyCollection<Category>> GetAllAsync(
        Guid tenantId,
        CancellationToken cancellationToken = default)
    {
        return await Context.Categories
            .Where(x => x.TenantId == tenantId)
            .OrderBy(x => x.SortOrder)
            .ThenBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> AllBelongToTenantAsync(
        Guid tenantId,
        IReadOnlyCollection<Guid> categoryIds,
        CancellationToken cancellationToken = default)
    {
        var distinctIds = categoryIds.Distinct().ToArray();
        if (distinctIds.Length == 0)
        {
            return true;
        }

        var matchingCount = await Context.Categories
            .AsNoTracking()
            .CountAsync(
                category =>
                    category.TenantId == tenantId &&
                    distinctIds.Contains(category.Id),
                cancellationToken);

        return matchingCount == distinctIds.Length;
    }

    public Task<bool> ExistsBySlugAsync(
    Guid tenantId,
    string slug,
    Guid? excludeId = null,
    CancellationToken cancellationToken = default)
    {
        return Context.Categories
            .AnyAsync(
                x =>
                    x.TenantId == tenantId &&
                    x.Slug == slug &&
                    (!excludeId.HasValue || x.Id != excludeId.Value),
                cancellationToken);
    }

    public Task<Category?> GetByIdAsync(Guid tenantId, Guid id, CancellationToken cancellationToken = default)
    {
        return Context.Categories
            .FirstOrDefaultAsync(
                x => x.Id == id &&
                     x.TenantId == tenantId,
                cancellationToken);
    }

    public async Task UpdateRangeAsync(
    IEnumerable<Category> categories,
    CancellationToken cancellationToken = default)
    {
        Context.Categories.UpdateRange(categories);

        await Context.SaveChangesAsync(cancellationToken);
    }
}
