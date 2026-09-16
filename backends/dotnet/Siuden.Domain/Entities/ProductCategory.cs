using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Domain.Entities;

public class ProductCategory: AuditableEntity<long>
{
    public long ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public bool IsPrimary { get; set; }
    public int SortOrder { get; set; }
    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;
}
