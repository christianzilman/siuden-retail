namespace Siuden.Application.Features.Customers.DTOs;

public sealed class CustomerDto
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    public Guid TenantId { get; init; }
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? Phone { get; init; }
}
