using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Siuden.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Infrastructure.Persistence.Configurations;

public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("Customers");

        builder.HasKey(x => x.Id);

        builder.Property(customer => customer.Name)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(customer => customer.SurName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(customer => customer.Email)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(customer => customer.Phone)
            .HasMaxLength(40);

        builder.HasIndex(customer => new
        {
            customer.TenantId,
            customer.UserId
        })
            .IsUnique();

        builder.HasOne(custonmer => custonmer.User)
            .WithMany(user => user.Customers)
            .HasForeignKey(customer => new
            {
                customer.TenantId,
                customer.UserId
            })
            .HasPrincipalKey(user => new
            {
                user.TenantId,
                user.Id
            })
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(custonmer => custonmer.Tenant)
            .WithMany(tenant => tenant.Customers)
            .HasForeignKey(customer => customer.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

    }
}
