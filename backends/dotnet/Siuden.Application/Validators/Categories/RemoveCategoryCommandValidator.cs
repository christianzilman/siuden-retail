using FluentValidation;
using Siuden.Application.Features.Categories.Commands;

namespace Siuden.Application.Validators.Categories;

public sealed class RemoveCategoryCommandValidator
    : AbstractValidator<RemoveCategoryCommand>
{
    public RemoveCategoryCommandValidator()
    {
        RuleFor(x => x.TenantSlug)
            .NotEmpty()
            .MaximumLength(100)
            .Matches("^[a-z0-9]+(?:-[a-z0-9]+)*$");

        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
