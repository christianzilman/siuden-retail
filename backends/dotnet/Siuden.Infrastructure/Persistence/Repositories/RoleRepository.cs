using Microsoft.EntityFrameworkCore;
using Siuden.Domain.Entities;
using Siuden.Domain.Repositories;

namespace Siuden.Infrastructure.Persistence.Repositories;

public sealed class RoleRepository
    : RepositoryBase<Role, Guid>, IRoleRepository
{
    public RoleRepository(SiudenRetailDbContext context)
        : base(context)
    {
    }

    public Task<Role?> GetByCodeAsync(
        string code,
        CancellationToken cancellationToken = default)
    {
        return Context.Roles.SingleOrDefaultAsync(
            role => role.Code == code,
            cancellationToken);
    }
}
