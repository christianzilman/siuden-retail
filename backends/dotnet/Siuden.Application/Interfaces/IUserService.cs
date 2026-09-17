using Siuden.Application.Features.Auth.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Interfaces;

public interface IUserService
{
    Task<LoginResultDto?> SignIn(string email, string password, CancellationToken cancellationToken);
}
