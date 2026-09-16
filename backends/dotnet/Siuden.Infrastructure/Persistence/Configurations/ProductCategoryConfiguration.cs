using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Siuden.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Infrastructure.Persistence.Configurations;

public class ProductCategoryConfiguration : IEntityTypeConfiguration<ProductCategory>
{
    public void Configure(EntityTypeBuilder<ProductCategory> builder)
    {
        builder.ToTable("ProductCategories");
        builder.HasKey(x => x.Id);

        builder.HasOne(productCategory => productCategory.Category)
            .WithMany(category => category.ProductCategories)
            .HasForeignKey(productCategory => productCategory.CategoryId);

        builder.HasOne(productCategory => productCategory.Product)
            .WithMany(product => product.ProductCategories)
            .HasForeignKey(productCategory => productCategory.ProductId);
    }
}
