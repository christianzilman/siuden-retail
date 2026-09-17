using System.Text;

namespace Siuden.Infrastructure.Authentication;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Key { get; init; } = string.Empty;
    public string Issuer { get; init; } = string.Empty;
    public string Audience { get; init; } = string.Empty;
    public int AccessTokenExpireMinutes { get; init; } = 15;
    public int RefreshTokenExpireDays { get; init; } = 30;

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

        if (RefreshTokenExpireDays <= 0)
        {
            throw new InvalidOperationException(
                "Jwt:RefreshTokenExpireDays must be greater than zero.");
        }
    }
}
