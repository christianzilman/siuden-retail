using System.Security.Claims;
using Siuden.Application.Common.Exceptions;

namespace Siuden.Api.Security;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetRequiredGuid(this ClaimsPrincipal principal, string claimType)
    {
        var value = principal.FindFirstValue(claimType);
        return Guid.TryParse(value, out var id)
            ? id
            : throw new UnauthorizedException(
                $"La identidad no contiene el claim requerido '{claimType}'.");
    }
}
