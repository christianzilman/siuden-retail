using Siuden.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Domain.Entities;

public class User: AuditableEntity<Guid>
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserStatusEnum Status { get; set; }
    public DateTime EmailVerifiedAt { get; set; }
    public ICollection<AccountMember> AccountMembers { get; set; } = [];
    public ICollection<Customer> Customers { get; set; } = [];
}
