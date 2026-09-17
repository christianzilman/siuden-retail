using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Siuden.Application.Common.Security;
using Siuden.Application.Features.Auth.DTOs;
using Siuden.Application.Interfaces;

namespace Siuden.Infrastructure.Authentication;

public sealed class JwtService(JwtOptions options) : IJwtService
{
    public GeneratedAccessTokenDto GenerateToken(AuthSessionDto session)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, session.UserId.ToString()),
            new(ClaimTypes.Name, session.Email),
            new(ClaimTypes.Email, session.Email),
            new(ClaimTypes.Role, session.Role),
            new(AuthClaimTypes.AccountId, session.AccountId.ToString()),
            new(AuthClaimTypes.TenantId, session.TenantId.ToString())
        };

        if (session.CustomerId.HasValue)
        {
            claims.Add(new Claim(
                AuthClaimTypes.CustomerId,
                session.CustomerId.Value.ToString()));
        }

        claims.AddRange(session.Permissions.Select(permission =>
            new Claim(AuthClaimTypes.Permission, permission)));

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Key)),
            SecurityAlgorithms.HmacSha256);

        var expiresAtUtc = DateTime.UtcNow.AddMinutes(
            options.AccessTokenExpireMinutes);

        var token = new JwtSecurityToken(
            issuer: options.Issuer,
            audience: options.Audience,
            claims: claims,
            expires: expiresAtUtc,
            signingCredentials: credentials);

        return new GeneratedAccessTokenDto(
            new JwtSecurityTokenHandler().WriteToken(token),
            expiresAtUtc);
    }
}
