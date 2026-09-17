namespace Siuden.Application.Features.AccountMembers.DTOs;

public sealed class AccountMemberDto
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    public string Email { get; init; } = string.Empty;
    public Guid AccountId { get; init; }
    public string Role { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
}
