using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Auth.DTOs;

public sealed class LoginResultDto
{
    public string AccessToken { get; init; } = string.Empty;
    public DateTime AccessTokenExpiresAtUtc { get; init; }
    public AuthSessionDto Session { get; init; } = new();

    [System.Text.Json.Serialization.JsonIgnore]
    public string RefreshToken { get; init; } = string.Empty;

    [System.Text.Json.Serialization.JsonIgnore]
    public DateTime RefreshTokenExpiresAtUtc { get; init; }
}

public sealed class AuthSessionDto
{
    public Guid UserId { get; init; }
    public string Email { get; init; } = string.Empty;
    public Guid AccountId { get; init; }
    public Guid TenantId { get; init; }
    public Guid? CustomerId { get; init; }
    public string Role { get; init; } = string.Empty;
    public IReadOnlyCollection<string> Permissions { get; init; } = [];
}

public sealed record GeneratedAccessTokenDto(
    string Token,
    DateTime ExpiresAtUtc);
