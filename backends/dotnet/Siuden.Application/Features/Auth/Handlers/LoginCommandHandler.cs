using MediatR;
using Siuden.Application.Features.Auth.Commands;
using Siuden.Application.Features.Auth.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Auth.Handlers;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResultDto>
{
    public async Task<LoginResultDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {


        //if (result == null)
        //{
        //    return new LoginResultDto
        //    {
        //        Success = false,
        //        ErrorMessage = "Credenciales inválidas"
        //    };
        //}


        throw new NotImplementedException();
    }
}
