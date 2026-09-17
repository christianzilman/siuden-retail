using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Auth.DTOs;

public class LoginResultDto
{
    public bool Success { get; set; }
    public string Token { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? ErrorMessage { get; set; }
}
