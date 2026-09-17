using Microsoft.EntityFrameworkCore;
using Siuden.Domain.Constants;
using Siuden.Domain.Entities;
using Siuden.Domain.Enums;
using Siuden.Domain.Repositories;

namespace Siuden.Infrastructure.Persistence.Repositories;

public sealed class AccountMemberRepository
    : RepositoryBase<AccountMember, Guid>, IAccountMemberRepository
{
    public AccountMemberRepository(SiudenRetailDbContext context)
        : base(context)
    {
    }

    public Task<AccountMember?> GetActiveByUserAndAccountAsync(
        Guid userId,
        Guid accountId,
        CancellationToken cancellationToken = default)
    {
        return Context.AccountMembers
            .Include(member => member.Role)
            .SingleOrDefaultAsync(member =>
                member.UserId == userId &&
                member.AccountId == accountId &&
                member.Status == AccountMemberStatusEnum.ACTIVE &&
                member.Account.Status == AccountStatusEnum.ACTIVE,
                cancellationToken);
    }

    public async Task<IReadOnlyList<AccountMember>> GetStaffByAccountAsync(
        Guid accountId,
        CancellationToken cancellationToken = default)
    {
        return await Context.AccountMembers
            .AsNoTracking()
            .Include(member => member.User)
            .Include(member => member.Role)
            .Where(member =>
                member.AccountId == accountId &&
                member.Role.Code != GlobalRoles.Customer)
            .OrderBy(member => member.Role.Code)
            .ThenBy(member => member.User.Email)
            .ToArrayAsync(cancellationToken);
    }

    public Task<AccountMember?> GetByIdAndAccountAsync(
        Guid memberId,
        Guid accountId,
        CancellationToken cancellationToken = default)
    {
        return Context.AccountMembers
            .Include(member => member.User)
            .Include(member => member.Role)
            .SingleOrDefaultAsync(member =>
                member.Id == memberId &&
                member.AccountId == accountId,
                cancellationToken);
    }
}
