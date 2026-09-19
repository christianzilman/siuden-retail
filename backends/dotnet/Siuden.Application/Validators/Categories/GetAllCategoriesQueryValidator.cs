using FluentValidation;
using Siuden.Application.Features.Categories.Queries;
using Siuden.Domain.Rules;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Validators.Categories;

public sealed class GetAllCategoriesQueryValidator : AbstractValidator<GetAllCategoriesQuery>
{
    public GetAllCategoriesQueryValidator()
    {
        RuleFor(query => query.TenantSlug)
            .NotEmpty()
            .Matches("^[a-z0-9]+(?:-[a-z0-9]+)*$")
            .MaximumLength(100)
            .Must(slug => !TenantSlugPolicy.IsReserved(slug))
            .WithMessage("El slug está reservado por la plataforma");
    }
}
