using FluentValidation;
using Siuden.Application.Features.Products.Commands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Validators.Products;

public class CreateProductCommandValidator
    : AbstractValidator<CreateProductCommand>
{
    public CreateProductCommandValidator()
    {
        RuleFor(x => x.Product.Name)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Product.Variants)
            .NotEmpty()
            .WithMessage("El producto debe tener al menos una variante.");

        RuleForEach(x => x.Product.Variants)
            .ChildRules(variant =>
            {
                variant.RuleFor(x => x.Price)
                    .GreaterThanOrEqualTo(0);

                variant.RuleFor(x => x.Stock)
                    .GreaterThanOrEqualTo(0);
            });

        RuleFor(x => x.Product.Categories)
            .Must(categories =>
                categories.Count(x => x.IsPrimary) <= 1)
            .WithMessage(
                "Solo puede existir una categoría principal.");
    }
}
