using Microsoft.EntityFrameworkCore;
using Siuden.Domain.Entities;
using Siuden.Domain.Enums;
using Siuden.Domain.Repositories;

namespace Siuden.Infrastructure.Persistence.Repositories;

public sealed class TenantRepository : ITenantRepository
{
    private readonly SiudenRetailDbContext _context;

    public TenantRepository(SiudenRetailDbContext context)
    {
        _context = context;
    }

    public Task<Tenant?> GetActiveBySlugAsync(
        string slug,
        CancellationToken cancellationToken = default)
    {
        return _context.Tenants
            .Where(tenant =>
                tenant.Slug == slug &&
                tenant.Status == TenantStatusEnum.ACTIVE &&
                tenant.Account.Status == AccountStatusEnum.ACTIVE)
            .SingleOrDefaultAsync(cancellationToken);
    }

    public Task<bool> IsActiveAndBelongsToAccountAsync(
        Guid tenantId,
        Guid accountId,
        CancellationToken cancellationToken = default)
    {
        return _context.Tenants.AnyAsync(tenant =>
            tenant.Id == tenantId &&
            tenant.AccountId == accountId &&
            tenant.Status == TenantStatusEnum.ACTIVE,
            cancellationToken);
    }

    public Task<Tenant?> GetByIdAsync(Guid tenantId, CancellationToken cancellationToken = default)
    {
        return _context.Tenants.SingleOrDefaultAsync(tenant => tenant.Id == tenantId, cancellationToken);
    }

    public async Task UpdateAsync(Tenant tenant, CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
