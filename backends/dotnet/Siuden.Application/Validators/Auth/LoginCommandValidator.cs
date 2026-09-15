using FluentValidation;
using Siuden.Application.Features.Auth.Commands;
using Siuden.Application.Features.Auth.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Validators.Auth;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("El nombre de usuario es requido")
            .MinimumLength(3).WithMessage("El nombre de usuario debe tener al menos 3 caracteres")
            .MaximumLength(100).WithMessage("El nombre de usuario no puede exceder 100 caracteres");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("La contraseña es requerida")
            .MinimumLength(6).WithMessage("La contraseña debe tener al menos 6 caracteres");
    }
}
