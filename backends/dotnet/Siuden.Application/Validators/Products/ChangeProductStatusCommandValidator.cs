using FluentValidation;
using Siuden.Application.Features.Products.Commands;

namespace Siuden.Application.Validators.Products;

public sealed class ChangeProductStatusCommandValidator
    : AbstractValidator<ChangeProductStatusCommand>
{
    public ChangeProductStatusCommandValidator()
    {
        RuleFor(command => command.TenantId).NotEmpty();
        RuleFor(command => command.ProductId).GreaterThan(0);
        RuleFor(command => command.Status).IsInEnum();
    }
}
