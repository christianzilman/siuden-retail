using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Siuden.Domain.Entities;

namespace Siuden.Infrastructure.Persistence.Configurations;

public sealed class RefreshSessionConfiguration : IEntityTypeConfiguration<RefreshSession>
{
    public void Configure(EntityTypeBuilder<RefreshSession> builder)
    {
        builder.ToTable("RefreshSessions");
        builder.HasKey(session => session.Id);

        builder.Property(session => session.TokenHash)
            .HasMaxLength(64)
            .IsRequired();

        builder.Property(session => session.RoleCode)
            .HasMaxLength(50)
            .IsRequired();

        builder.HasIndex(session => session.TokenHash)
            .IsUnique();
        builder.HasIndex(session => session.FamilyId);
        builder.HasIndex(session => new { session.UserId, session.RevokedAt });

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(session => session.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Account>()
            .WithMany()
            .HasForeignKey(session => session.AccountId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Tenant>()
            .WithMany()
            .HasForeignKey(session => session.TenantId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Customer>()
            .WithMany()
            .HasForeignKey(session => session.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
