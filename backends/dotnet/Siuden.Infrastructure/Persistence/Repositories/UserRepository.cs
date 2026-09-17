using Microsoft.EntityFrameworkCore;
using Siuden.Domain.Entities;
using Siuden.Domain.Enums;
using Siuden.Domain.Repositories;

namespace Siuden.Infrastructure.Persistence.Repositories;

public sealed class UserRepository : RepositoryBase<User, Guid>, IUserRepository
{
    public UserRepository(SiudenRetailDbContext context) : base(context)
    {
    }

    public Task<User?> GetActiveByEmailAsync(
        string email,
        CancellationToken cancellationToken = default)
    {
        return Context.Users.FirstOrDefaultAsync(
            user => user.Email == email && user.Status == UserStatusEnum.ACTIVE,
            cancellationToken);
    }
}
