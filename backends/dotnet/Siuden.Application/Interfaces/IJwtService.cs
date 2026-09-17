using Siuden.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Interfaces;

public interface IJwtService
{
    Siuden.Application.Features.Auth.DTOs.GeneratedAccessTokenDto GenerateToken(
        Siuden.Application.Features.Auth.DTOs.AuthSessionDto session);
}
