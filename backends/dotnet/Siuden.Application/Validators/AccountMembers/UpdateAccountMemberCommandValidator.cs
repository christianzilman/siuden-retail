using FluentValidation;
using Siuden.Application.Features.AccountMembers.Commands;
using Siuden.Domain.Constants;

namespace Siuden.Application.Validators.AccountMembers;

public sealed class UpdateAccountMemberCommandValidator : AbstractValidator<UpdateAccountMemberCommand>
{
    private static readonly string[] AssignableRoles = [GlobalRoles.Admin, GlobalRoles.Seller, GlobalRoles.StockManager];
    private static readonly string[] AssignableStatuses = ["ACTIVE", "BLOCKED"];

    public UpdateAccountMemberCommandValidator()
    {
        RuleFor(command => command.RequesterUserId).NotEmpty();
        RuleFor(command => command.AccountId).NotEmpty();
        RuleFor(command => command.MemberId).NotEmpty();

        RuleFor(command => command)
            .Must(command =>
                !string.IsNullOrWhiteSpace(command.RoleCode) ||
                !string.IsNullOrWhiteSpace(command.Status))
            .WithMessage("Debe informarse un rol o estado para modificar");

        RuleFor(command => command.RoleCode!)
            .Must(role => AssignableRoles.Contains(role.Trim().ToUpperInvariant()))
            .When(command => !string.IsNullOrWhiteSpace(command.RoleCode))
            .WithMessage("El rol solicitado no puede asignarse");

        RuleFor(command => command.Status!)
            .Must(status => AssignableStatuses.Contains(status.Trim().ToUpperInvariant()))
            .When(command => !string.IsNullOrWhiteSpace(command.Status))
            .WithMessage("El estado solicitado no es válido");
    }
}
