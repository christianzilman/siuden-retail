using MediatR;
using Siuden.Application.Features.Customers.DTOs;

namespace Siuden.Application.Features.Customers.Commands;

public sealed class RegisterCustomerCommand : IRequest<CustomerDto>
{
    public string TenantSlug { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Password { get; set; } = string.Empty;
    public string PasswordConfirmation { get; set; } = string.Empty;
}
