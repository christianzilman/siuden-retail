namespace Siuden.Api.Contracts.Customers;

public sealed class RegisterCustomerRequest
{
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? Phone { get; init; }
    public string Password { get; init; } = string.Empty;
    public string PasswordConfirmation { get; init; } = string.Empty;
}
