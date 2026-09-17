using Siuden.Domain.Entities;

namespace Siuden.Domain.Repositories;

public interface IRoleRepository : IAsyncRepository<Role, Guid>
{
    Task<Role?> GetByCodeAsync(
        string code,
        CancellationToken cancellationToken = default);
}
