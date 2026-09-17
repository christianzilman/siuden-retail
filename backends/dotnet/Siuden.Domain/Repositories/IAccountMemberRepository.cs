using Siuden.Domain.Entities;

namespace Siuden.Domain.Repositories;

public interface IAccountMemberRepository : IAsyncRepository<AccountMember, Guid>
{
    Task<AccountMember?> GetActiveByUserAndAccountAsync(
        Guid userId,
        Guid accountId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<AccountMember>> GetStaffByAccountAsync(
        Guid accountId,
        CancellationToken cancellationToken = default);

    Task<AccountMember?> GetByIdAndAccountAsync(
        Guid memberId,
        Guid accountId,
        CancellationToken cancellationToken = default);
}
