using MediatR;
using Siuden.Application.Features.AccountMembers.DTOs;

namespace Siuden.Application.Features.AccountMembers.Commands;

public sealed class UpdateAccountMemberCommand : IRequest<AccountMemberDto>
{
    public Guid RequesterUserId { get; init; }
    public Guid AccountId { get; init; }
    public Guid MemberId { get; init; }
    public string? RoleCode { get; init; }
    public string? Status { get; init; }
}
