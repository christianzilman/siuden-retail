using FluentValidation;
using Siuden.Application.Features.Tenants.Queries;
using Siuden.Domain.Rules;

namespace Siuden.Application.Validators.Tenants;

public sealed class GetPublicTenantQueryValidator : AbstractValidator<GetPublicTenantQuery>
{
    public GetPublicTenantQueryValidator()
    {
        RuleFor(query => query.TenantSlug)
            .NotEmpty()
            .Matches("^[a-z0-9]+(?:-[a-z0-9]+)*$")
            .MaximumLength(100)
            .Must(slug => !TenantSlugPolicy.IsReserved(slug))
            .WithMessage("El slug está reservado por la plataforma");
    }
}
