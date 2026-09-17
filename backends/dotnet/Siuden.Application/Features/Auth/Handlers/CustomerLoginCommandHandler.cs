using MediatR;
using Siuden.Application.Features.Auth.Commands;
using Siuden.Application.Features.Auth.DTOs;
using Siuden.Application.Interfaces;

namespace Siuden.Application.Features.Auth.Handlers;

public sealed class CustomerLoginCommandHandler(IAuthenticationService authenticationService)
    : IRequestHandler<CustomerLoginCommand, LoginResultDto>
{
    public Task<LoginResultDto> Handle(CustomerLoginCommand request, CancellationToken cancellationToken)
    {
        return authenticationService.SignInCustomerAsync(
            request.TenantSlug,
            request.Email,
            request.Password,
            cancellationToken);
    }
}
