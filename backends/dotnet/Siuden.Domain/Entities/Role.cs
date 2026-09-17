using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Domain.Entities;

public class Role : AuditableEntity<Guid>
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ICollection<AccountMember> AccountMembers { get; set; } = [];
    public ICollection<RolePermission> RolePermissions { get; set; } = [];
}
