using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Domain.Entities;

public class ProductImage: AuditableEntity<long>
{
    public string Url { get; set; }
    public bool IsPrimary { get; set; }
    public int SortOrder { get; set; }
    public long ProductId { get; set; }
    public Product Product { get; set; } = null!;
}
