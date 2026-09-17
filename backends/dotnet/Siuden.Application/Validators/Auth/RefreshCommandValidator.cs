using FluentValidation;
using Siuden.Application.Features.Auth.Commands;

namespace Siuden.Application.Validators.Auth;

public sealed class RefreshCommandValidator : AbstractValidator<RefreshCommand>
{
    public RefreshCommandValidator()
    {
        RuleFor(command => command.RefreshToken)
            .NotEmpty()
            .MaximumLength(256);
    }
}
