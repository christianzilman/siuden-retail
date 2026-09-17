namespace Siuden.Domain.Rules;

public static class TenantSlugPolicy
{
    private static readonly HashSet<string> ReservedSlugs = new(
        ["admin", "api", "assets", "login"],
        StringComparer.OrdinalIgnoreCase);

    public static bool IsReserved(string slug) =>
        ReservedSlugs.Contains(slug.Trim());
}
