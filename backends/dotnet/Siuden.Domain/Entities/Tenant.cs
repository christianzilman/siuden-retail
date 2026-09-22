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
    public string BrandName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string AddressLine { get; set; } = string.Empty;
    public string AddressNumber { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string CountryCode { get; set; } = string.Empty;
    public string PrimaryColor { get; set; } = string.Empty;
    public string SecondaryColor { get; set; } = string.Empty;
    public string BackgroundColor { get; set; } = string.Empty;
    public string TextColor { get; set; } = string.Empty;
    public string HeadingFont { get; set; } = string.Empty;
    public string BodyFont { get; set; } = string.Empty;
    public string BorderRadius { get; set; } = string.Empty;
    public bool AnnouncementEnabled { get; set; }
    public string AnnouncementText { get; set; } = string.Empty;
    public string? AnnouncementUrl { get; set; }
    public string? FaviconUrl { get; set; }
    public string? LogoUrl { get; set; }
    public TenantStatusEnum Status { get; set; }
    public Guid AccountId { get; set; }
    public Account Account { get; set; } = null!;
    public ICollection<User> Users { get; set; } = [];
    public ICollection<Customer> Customers { get; set; } = [];
    public ICollection<Product> Products { get; set; } = [];
    public ICollection<Category> Categories { get; set; } = [];
}
