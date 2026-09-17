using FluentValidation;
using Siuden.Application.Features.Auth.Commands;
using Siuden.Domain.Rules;

namespace Siuden.Application.Validators.Auth;

public sealed class CustomerLoginCommandValidator : AbstractValidator<CustomerLoginCommand>
{
    public CustomerLoginCommandValidator()
    {
        RuleFor(command => command.TenantSlug)
            .NotEmpty()
            .Matches("^[a-z0-9]+(?:-[a-z0-9]+)*$")
            .MaximumLength(100)
            .Must(slug => !TenantSlugPolicy.IsReserved(slug))
            .WithMessage("El slug está reservado por la plataforma");

        RuleFor(command => command.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(255);

        RuleFor(command => command.Password)
            .NotEmpty()
            .MinimumLength(8)
            .MaximumLength(128);
    }
}
