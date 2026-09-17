using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Siuden.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Infrastructure.Persistence.Configurations;

public class AccountMemberConfiguration : IEntityTypeConfiguration<AccountMember>
{
    public void Configure(EntityTypeBuilder<AccountMember> builder)
    {
        builder.ToTable("AccountMembers");

        builder.HasKey(accountMember => accountMember.Id);

        builder.HasIndex(accountMember => new
        {
            accountMember.AccountId,
            accountMember.UserId
        })
            .IsUnique();

        builder.HasOne(acccountMember => acccountMember.User)
            .WithMany(user => user.AccountMembers)
            .HasForeignKey(acccountMember => acccountMember.UserId);

        builder.HasOne(acccountMember => acccountMember.Role)
            .WithMany(role => role.AccountMembers)
            .HasForeignKey(acccountMember => acccountMember.RoleId);

        builder.HasOne(acccountMember => acccountMember.Account)
            .WithMany(acccountMember => acccountMember.AccountMembers)
            .HasForeignKey(acccountMember => acccountMember.AccountId);
    }
}
