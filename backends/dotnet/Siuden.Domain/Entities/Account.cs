using Siuden.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Domain.Entities;

public class Account: AuditableEntity<Guid>
{
    public string Name { get; set; }
    public AccountStatusEnum Status { get; set; }
    public ICollection<AccountMember> AccountMembers { get; set; } = [];
    public ICollection<Tenant> Tenants { get; set; } = [];
}
