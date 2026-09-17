using MediatR;
using Siuden.Application.Features.Auth.DTOs;

namespace Siuden.Application.Features.Auth.Commands;

public sealed class CustomerLoginCommand : IRequest<LoginResultDto>
{
    public string TenantSlug { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
