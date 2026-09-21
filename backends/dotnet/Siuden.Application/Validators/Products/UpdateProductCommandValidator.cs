using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Validators.Products;

using FluentValidation;
using Siuden.Application.Features.Products.Commands;

public class UpdateProductCommandValidator: AbstractValidator<UpdateProductCommand>
{
    public UpdateProductCommandValidator()
    {
        RuleFor(x => x.ProductId)
            .GreaterThan(0);

        RuleFor(x => x.Product.TenantId)
            .NotEmpty();

        RuleFor(x => x.Product.Name)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Product.Description)
            .MaximumLength(5000);

        RuleFor(x => x.Product.SeoTitle)
            .MaximumLength(200);

        RuleFor(x => x.Product.SeoDescription)
            .MaximumLength(500);

        RuleFor(x => x.Product.Variants)
            .NotEmpty()
            .WithMessage(
                "El producto debe tener al menos una variante.");

        RuleForEach(x => x.Product.Variants)
            .ChildRules(variant =>
            {
                variant.RuleFor(x => x.VariantName)
                    .NotEmpty()
                    .MaximumLength(200);

                variant.RuleFor(x => x.Sku)
                    .MaximumLength(100);

                variant.RuleFor(x => x.BarCode)
                    .MaximumLength(100);

                variant.RuleFor(x => x.Stock)
                    .GreaterThanOrEqualTo(0);

                variant.RuleFor(x => x.Price)
                    .GreaterThanOrEqualTo(0);

                variant.RuleFor(x => x.Cost)
                    .GreaterThanOrEqualTo(0);

                variant.RuleFor(x => x.WeightKg)
                    .GreaterThanOrEqualTo(0)
                    .When(x => x.WeightKg.HasValue);

                variant.RuleFor(x => x.HeightCm)
                    .GreaterThanOrEqualTo(0)
                    .When(x => x.HeightCm.HasValue);

                variant.RuleFor(x => x.WidthCm)
                    .GreaterThanOrEqualTo(0)
                    .When(x => x.WidthCm.HasValue);

                variant.RuleFor(x => x.DepthCm)
                    .GreaterThanOrEqualTo(0)
                    .When(x => x.DepthCm.HasValue);
            });

        // Evita mandar la misma variante dos veces.
        RuleFor(x => x.Product.Variants)
            .Must(variants =>
            {
                var ids = variants
                    .Where(x => x.Id.HasValue)
                    .Select(x => x.Id!.Value)
                    .ToList();

                return ids.Count == ids.Distinct().Count();
            })
            .WithMessage(
                "No se puede enviar la misma variante de producto más de una vez.");

        // Evita la misma categoría dos veces.
        RuleFor(x => x.Product.Categories)
            .Must(categories =>
                categories
                    .Select(x => x.CategoryId)
                    .Distinct()
                    .Count() == categories.Count)
            .WithMessage(
                "La misma categoría no puede enviarse más de una vez.");

        // Máximo una categoría principal.
        RuleFor(x => x.Product.Categories)
            .Must(categories =>
                categories.Count(x => x.IsPrimary) <= 1)
            .WithMessage(
                "Solo una categoría puede ser la principal.");
    }
}
