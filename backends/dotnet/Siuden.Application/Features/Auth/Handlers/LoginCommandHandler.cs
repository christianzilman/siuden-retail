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
    public readonly IUserService _userService;

    public LoginCommandHandler(IUserService userService)
    {
        _userService = userService;
    }

    public async Task<LoginResultDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var result = await _userService.SignIn(
            request.Email,
            request.Password,
            cancellationToken);

        if (result == null)
        {
            return new LoginResultDto
            {
                Success = false,
                ErrorMessage = "Credenciales inválidas"
            };
        }

        result.Success = true;
        return result;
    }
}
