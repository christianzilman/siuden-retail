using Siuden.Domain.Entities;

namespace Siuden.Domain.Repositories;

public interface IUserRepository : IAsyncRepository<User, Guid>
{
    Task<User?> GetActiveByEmailAsync(
        string email,
        CancellationToken cancellationToken = default);
}
