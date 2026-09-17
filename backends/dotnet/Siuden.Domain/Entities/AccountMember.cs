using Siuden.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Domain.Entities;

public class AccountMember : AuditableEntity<Guid>
{
    public Guid AccountId { get; set; }
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }
    public User User { get; set; } = null!;
    public Role Role { get; set; } = null!;
    public Account Account { get; set; } = null!;
    public AccountMemberStatusEnum Status { get; set; }
}
