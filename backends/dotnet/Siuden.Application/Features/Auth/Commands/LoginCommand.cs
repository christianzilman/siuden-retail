using MediatR;
using Siuden.Application.Features.Auth.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Auth.Commands;

public class LoginCommand: IRequest<LoginResultDto>
{
    public string Email { get; set; }
    public string Password { get; set; }
}
