using FluentValidation;
using Siuden.Application.Features.Auth.Commands;

using Siuden.Domain.Rules;

namespace Siuden.Application.Validators.Auth;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.TenantSlug)
            .NotEmpty()
            .Matches("^[a-z0-9]+(?:-[a-z0-9]+)*$")
            .MaximumLength(100)
            .Must(slug => !TenantSlugPolicy.IsReserved(slug))
            .WithMessage("El slug está reservado por la plataforma");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("El email es requerido")
            .EmailAddress().WithMessage("El email no tiene un formato válido")
            .MaximumLength(255).WithMessage("El email no puede exceder 255 caracteres");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("La contraseña es requerida")
            .MinimumLength(8).WithMessage("La contraseña debe tener al menos 8 caracteres")
            .MaximumLength(128).WithMessage("La contraseña no puede exceder 128 caracteres");
    }
}
