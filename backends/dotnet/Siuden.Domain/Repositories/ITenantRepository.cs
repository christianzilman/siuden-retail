using Siuden.Domain.Entities;

namespace Siuden.Domain.Repositories;

public interface ITenantRepository
{
    Task<Tenant?> GetActiveBySlugAsync(
        string slug,
        CancellationToken cancellationToken = default);

    Task<bool> IsActiveAndBelongsToAccountAsync(
        Guid tenantId,
        Guid accountId,
        CancellationToken cancellationToken = default);
}
