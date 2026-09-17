namespace Siuden.Api.Contracts.AccountMembers;

public sealed class UpdateAccountMemberRequest
{
    public string? RoleCode { get; init; }
    public string? Status { get; init; }
}
