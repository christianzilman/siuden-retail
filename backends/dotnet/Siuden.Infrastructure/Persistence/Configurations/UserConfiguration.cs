using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Siuden.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(user => user.Id);

        builder.Property(user => user.Email)
            .HasMaxLength(255)
            .IsRequired();

        builder.HasIndex(user => new
        {
            user.TenantId,
            user.Email
        })
            .IsUnique();

        builder.HasAlternateKey(user => new
        {
            user.TenantId,
            user.Id
        });

        builder.Property(user => user.PasswordHash)
            .IsRequired();

        builder.HasOne(user => user.Tenant)
            .WithMany(tenant => tenant.Users)
            .HasForeignKey(user => user.TenantId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
