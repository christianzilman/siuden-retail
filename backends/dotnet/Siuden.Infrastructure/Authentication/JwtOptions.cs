using System.Text;

namespace Siuden.Infrastructure.Authentication;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Key { get; init; } = string.Empty;
    public string Issuer { get; init; } = string.Empty;
    public string Audience { get; init; } = string.Empty;
    public int AccessTokenExpireMinutes { get; init; } = 15;
    public int RefreshTokenIdleExpireDays { get; init; } = 7;
    public int RefreshSessionAbsoluteExpireDays { get; init; } = 30;
    public int RefreshTokenReuseGraceSeconds { get; init; } = 10;

    public void Validate()
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(Key);
        ArgumentException.ThrowIfNullOrWhiteSpace(Issuer);
        ArgumentException.ThrowIfNullOrWhiteSpace(Audience);

        if (Encoding.UTF8.GetByteCount(Key) < 32)
        {
            throw new InvalidOperationException(
                "Jwt:Key must contain at least 32 bytes for HMAC-SHA256.");
        }

        if (AccessTokenExpireMinutes <= 0)
        {
            throw new InvalidOperationException(
                "Jwt:AccessTokenExpireMinutes must be greater than zero.");
        }

        if (RefreshTokenIdleExpireDays <= 0)
        {
            throw new InvalidOperationException(
                "Jwt:RefreshTokenIdleExpireDays must be greater than zero.");
        }

        if (RefreshSessionAbsoluteExpireDays < RefreshTokenIdleExpireDays)
        {
            throw new InvalidOperationException(
                "Jwt:RefreshSessionAbsoluteExpireDays must be greater than or equal to Jwt:RefreshTokenIdleExpireDays.");
        }

        if (RefreshTokenReuseGraceSeconds < 0)
        {
            throw new InvalidOperationException(
                "Jwt:RefreshTokenReuseGraceSeconds cannot be negative.");
        }
    }
}
