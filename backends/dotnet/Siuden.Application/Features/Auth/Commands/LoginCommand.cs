using MediatR;
using Siuden.Application.Features.Auth.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Auth.Commands;

public sealed class LoginCommand : IRequest<LoginResultDto>
{
    public string TenantSlug { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
