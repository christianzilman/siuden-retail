namespace Siuden.Api.Contracts.AccountMembers;

public sealed class CreateAccountMemberRequest
{
    public string Email { get; init; } = string.Empty;
    public string RoleCode { get; init; } = string.Empty;
    public string TemporaryPassword { get; init; } = string.Empty;
}
