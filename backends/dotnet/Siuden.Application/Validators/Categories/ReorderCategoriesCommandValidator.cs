using FluentValidation;
using Siuden.Application.Features.Categories.Commands;

namespace Siuden.Application.Validators.Categories;

public sealed class ReorderCategoriesCommandValidator
    : AbstractValidator<ReorderCategoriesCommand>
{
    public ReorderCategoriesCommandValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();

        RuleFor(x => x.Items)
            .NotNull()
            .NotEmpty();

        RuleFor(x => x.Items)
            .Must(items => items.Select(i => i.Id).Distinct().Count() == items.Count)
            .WithMessage("No puede enviarse la misma categoría más de una vez.");

        RuleForEach(x => x.Items)
            .ChildRules(item =>
            {
                item.RuleFor(x => x.Id)
                    .NotEmpty();

                item.RuleFor(x => x.SortOrder)
                    .GreaterThanOrEqualTo(0);

                item.RuleFor(x => x)
                    .Must(x => x.Id != x.ParentId)
                    .WithMessage("Una categoría no puede ser padre de sí misma.");
            });
    }
}
