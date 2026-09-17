using Microsoft.EntityFrameworkCore;
using Siuden.Domain.Entities;
using Siuden.Domain.Enums;
using Siuden.Domain.Repositories;
using System.Threading;

namespace Siuden.Infrastructure.Persistence.Repositories;

public sealed class UserRepository : RepositoryBase<User, Guid>, IUserRepository
{
    public UserRepository(SiudenRetailDbContext context) : base(context)
    {
    }

    public async Task<bool> ExistByTenantIdAndEmail(Guid tenantId, 
        string email, 
        CancellationToken cancellationToken = default)
    {
        return await Context.Users.AnyAsync(
                user => user.TenantId == tenantId && user.Email == email,
                cancellationToken);
    }

    public Task<User?> GetActiveByEmailAsync(
        Guid tenantId,
        string email,
        CancellationToken cancellationToken = default)
    {
        return Context.Users.FirstOrDefaultAsync(
            user =>
                user.TenantId == tenantId &&
                user.Email == email &&
                user.Status == UserStatusEnum.ACTIVE,
            cancellationToken);
    }
}
