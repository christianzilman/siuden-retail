using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Siuden.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Infrastructure.Persistence.Configurations;

public class TenantConfiguration : IEntityTypeConfiguration<Tenant>
{
    public void Configure(EntityTypeBuilder<Tenant> builder)
    {
        builder.ToTable("Tenants");
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Name)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(t => t.Slug)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(t => t.BrandName).HasMaxLength(200).IsRequired();
        builder.Property(t => t.ContactEmail).HasMaxLength(255).IsRequired();
        builder.Property(t => t.Phone).HasMaxLength(30).IsRequired();
        builder.Property(t => t.AddressLine).HasMaxLength(200).IsRequired();
        builder.Property(t => t.AddressNumber).HasMaxLength(30).IsRequired();
        builder.Property(t => t.City).HasMaxLength(150).IsRequired();
        builder.Property(t => t.Province).HasMaxLength(150).IsRequired();
        builder.Property(t => t.PostalCode).HasMaxLength(20).IsRequired();
        builder.Property(t => t.CountryCode).HasMaxLength(2).IsRequired();
        builder.Property(t => t.PrimaryColor).HasMaxLength(20).IsRequired();
        builder.Property(t => t.SecondaryColor).HasMaxLength(20).IsRequired();
        builder.Property(t => t.BackgroundColor).HasMaxLength(20).IsRequired();
        builder.Property(t => t.TextColor).HasMaxLength(20).IsRequired();
        builder.Property(t => t.HeadingFont).HasMaxLength(200).IsRequired();
        builder.Property(t => t.BodyFont).HasMaxLength(200).IsRequired();
        builder.Property(t => t.BorderRadius).HasMaxLength(20).IsRequired();
        builder.Property(t => t.AnnouncementText).HasMaxLength(300).IsRequired();
        builder.Property(t => t.AnnouncementUrl).HasMaxLength(2048);
        builder.Property(t => t.FaviconUrl).HasMaxLength(2048);
        builder.Property(t => t.LogoUrl).HasMaxLength(2048);

        builder.HasIndex(t => t.Slug)
            .IsUnique();

        builder.HasOne(tenant => tenant.Account)
            .WithMany(account => account.Tenants)
            .HasForeignKey(account => account.AccountId);
    }
}
