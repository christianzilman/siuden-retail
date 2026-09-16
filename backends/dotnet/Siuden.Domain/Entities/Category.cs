using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Domain.Entities;

public class Category: AuditableEntity<Guid>
{
    public Guid TenantId { get; set; }
    public Tenant Tenant { get; set; }
    public Guid? ParentId { get; set; }
    public string Name { get; set; }
    public string Slug { get; set; }
    public string Description { get; set; }
    public int SortOrder { get; set; }
    public bool IsVisible { get; set; }
    public ICollection<ProductCategory> ProductCategories { get; set; } = [];
}
