using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Siuden.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Infrastructure.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");
        builder.HasKey(x => x.Id);

        builder.Property(p => p.Name)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(p => p.Slug)
            .HasMaxLength(200);

        builder.Property(p => p.SeoTitle)
            .HasMaxLength(255);

        builder.Property(p => p.Description)
            .HasMaxLength(500);

        builder.HasOne(product => product.Tenant)
            .WithMany(tenant => tenant.Products)
            .HasForeignKey(product => product.TenantId);
    }
}
