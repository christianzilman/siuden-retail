using Siuden.Domain.Entities;

namespace Siuden.Domain.Repositories;

public interface IUserRepository : IAsyncRepository<User, Guid>
{
    Task<bool> ExistByTenantIdAndEmail(Guid tenantId, string email, CancellationToken cancellationToken = default);
    Task<User?> GetActiveByEmailAsync(
        Guid tenantId,
        string email,
        CancellationToken cancellationToken = default);
}
