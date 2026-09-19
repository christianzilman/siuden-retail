using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Siuden.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Infrastructure.Persistence.Configurations;

public class ProductVarientConfiguration : IEntityTypeConfiguration<ProductVariant>
{
    public void Configure(EntityTypeBuilder<ProductVariant> builder)
    {
        builder.ToTable("ProductVarients");
        builder.HasKey(x => x.Id);
        
        builder.Property(p => p.VariantName)
            .HasMaxLength(255);
        builder.Property(p => p.Sku)
            .HasMaxLength(255);
        builder.Property(p => p.BarCode)
            .HasMaxLength(255);

        builder.HasOne(productVarient => productVarient.Product)
            .WithMany(product => product.ProductVariants)
            .HasForeignKey(productVarient => productVarient.ProductId);
    }
}
