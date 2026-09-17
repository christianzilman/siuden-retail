using FluentValidation;
using Siuden.Application.Features.Customers.Commands;
using Siuden.Domain.Rules;

namespace Siuden.Application.Validators.Customers;

public sealed class RegisterCustomerCommandValidator : AbstractValidator<RegisterCustomerCommand>
{
    public RegisterCustomerCommandValidator()
    {
        RuleFor(command => command.TenantSlug)
            .NotEmpty()
            .Matches("^[a-z0-9]+(?:-[a-z0-9]+)*$")
            .MaximumLength(100)
            .Must(slug => !TenantSlugPolicy.IsReserved(slug))
            .WithMessage("El slug está reservado por la plataforma");

        RuleFor(command => command.FirstName)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(command => command.LastName)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(command => command.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(255);

        RuleFor(command => command.Phone)
            .MaximumLength(40)
            .When(command => !string.IsNullOrWhiteSpace(command.Phone));

        RuleFor(command => command.Password)
            .NotEmpty()
            .MinimumLength(8)
            .MaximumLength(128);

        RuleFor(command => command.PasswordConfirmation)
            .Equal(command => command.Password)
            .WithMessage("Las contraseñas no coinciden");
    }
}
