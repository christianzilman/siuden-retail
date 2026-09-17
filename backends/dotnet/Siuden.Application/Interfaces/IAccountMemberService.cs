using Siuden.Application.Features.AccountMembers.Commands;
using Siuden.Application.Features.AccountMembers.DTOs;

namespace Siuden.Application.Interfaces;

public interface IAccountMemberService
{
    Task<AccountMemberDto> CreateAsync(CreateAccountMemberCommand command, CancellationToken cancellationToken);
    Task<IReadOnlyCollection<AccountMemberDto>> GetAllAsync(
        Guid requesterUserId,
        Guid accountId,
        CancellationToken cancellationToken);
    Task<AccountMemberDto> UpdateAsync(
        UpdateAccountMemberCommand command,
        CancellationToken cancellationToken);
}
