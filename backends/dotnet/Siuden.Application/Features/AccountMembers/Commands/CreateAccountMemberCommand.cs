using MediatR;
using Siuden.Application.Features.AccountMembers.DTOs;

namespace Siuden.Application.Features.AccountMembers.Commands;

public sealed class CreateAccountMemberCommand : IRequest<AccountMemberDto>
{
    public Guid RequesterUserId { get; init; }
    public Guid AccountId { get; init; }
    public Guid TenantId { get; init; }
    public string Email { get; init; } = string.Empty;
    public string RoleCode { get; init; } = string.Empty;
    public string TemporaryPassword { get; init; } = string.Empty;
}
