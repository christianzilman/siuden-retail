using Siuden.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Domain.Entities;

public class Product: AuditableEntity<long>
{
    public Guid TenantId { get; set; }
    public Tenant Tenant { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public ProductStatusEnum Status { get; set; }
    public string Slug { get; set; }
    public string SeoTitle { get; set; }
    public string SeoDescription { get; set; }
    public ICollection<ProductVariant> ProductVariants { get; set; } = [];
    public ICollection<ProductCategory> ProductCategories { get; set; } = [];
    public ICollection<ProductImage> ProductImages { get; set; } = [];

}
