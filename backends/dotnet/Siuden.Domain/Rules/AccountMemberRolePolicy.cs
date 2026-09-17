using Siuden.Domain.Constants;

namespace Siuden.Domain.Rules;

public static class AccountMemberRolePolicy
{
    private static readonly IReadOnlyDictionary<string, string[]> AssignableRoles =
        new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase)
        {
            [GlobalRoles.Owner] = [GlobalRoles.Admin, GlobalRoles.Seller, GlobalRoles.StockManager],
            [GlobalRoles.Admin] = [GlobalRoles.Seller, GlobalRoles.StockManager]
        };

    public static bool CanAssign(string requesterRole, string requestedRole) =>
        AssignableRoles.TryGetValue(requesterRole, out var roles) &&
        roles.Contains(requestedRole, StringComparer.OrdinalIgnoreCase);

    public static bool CanManage(string requesterRole, string targetRole) =>
        requesterRole.Equals(GlobalRoles.Owner, StringComparison.OrdinalIgnoreCase)
            ? !targetRole.Equals(GlobalRoles.Owner, StringComparison.OrdinalIgnoreCase)
            : requesterRole.Equals(GlobalRoles.Admin, StringComparison.OrdinalIgnoreCase) &&
              (targetRole.Equals(GlobalRoles.Seller, StringComparison.OrdinalIgnoreCase) ||
               targetRole.Equals(GlobalRoles.StockManager, StringComparison.OrdinalIgnoreCase));

    public static bool CanManageMembers(string requesterRole) =>
        AssignableRoles.ContainsKey(requesterRole);
}
