using FluentValidation;
using Siuden.Application.Features.Categories.Commands;

namespace Siuden.Application.Validators.Categories;

public sealed class RemoveCategoryCommandValidator
    : AbstractValidator<RemoveCategoryCommand>
{
    public RemoveCategoryCommandValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();

        RuleFor(x => x.Id)
            .NotEmpty();
    }
}
