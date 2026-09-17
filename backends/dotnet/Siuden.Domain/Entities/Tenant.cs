using Siuden.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Domain.Entities;

public class Tenant : AuditableEntity<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public TenantStatusEnum Status { get; set; }
    public Guid AccountId { get; set; }
    public Account Account { get; set; } = null!;
    public ICollection<User> Users { get; set; } = [];
    public ICollection<Customer> Customers { get; set; } = [];
    public ICollection<Product> Products { get; set; } = [];
    public ICollection<Category> Categories { get; set; } = [];
}
