using FluentValidation;
using Siuden.Application.Features.AccountMembers.Commands;
using Siuden.Domain.Constants;

namespace Siuden.Application.Validators.AccountMembers;

public sealed class CreateAccountMemberCommandValidator : AbstractValidator<CreateAccountMemberCommand>
{
    private static readonly string[] AssignableRoles = [GlobalRoles.Admin, GlobalRoles.Seller, GlobalRoles.StockManager];

    public CreateAccountMemberCommandValidator()
    {
        RuleFor(command => command.RequesterUserId).NotEmpty();
        RuleFor(command => command.AccountId).NotEmpty();
        RuleFor(command => command.TenantId).NotEmpty();

        RuleFor(command => command.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(255);

        RuleFor(command => command.RoleCode)
            .NotEmpty()
            .Must(role => AssignableRoles.Contains(role.Trim().ToUpperInvariant()))
            .WithMessage("El rol solicitado no puede asignarse desde este endpoint");

        RuleFor(command => command.TemporaryPassword)
            .NotEmpty()
            .MinimumLength(8)
            .MaximumLength(128);
    }
}
