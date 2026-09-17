using MediatR;
using Siuden.Application.Features.Auth.Commands;
using Siuden.Application.Features.Auth.DTOs;
using Siuden.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Auth.Handlers;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResultDto>
{
    private readonly IAuthenticationService _authenticationService;

    public LoginCommandHandler(IAuthenticationService authenticationService)
    {
        _authenticationService = authenticationService;
    }

    public async Task<LoginResultDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        return await _authenticationService.SignInStaffAsync(
            request.TenantSlug,
            request.Email,
            request.Password,
            cancellationToken);
    }
}
