using FluentValidation;
using Siuden.Application.Features.Products.Queries;

namespace Siuden.Application.Validators.Products;

public sealed class GetAdminProductsQueryValidator
    : AbstractValidator<GetAdminProductsQuery>
{
    public GetAdminProductsQueryValidator()
    {
        RuleFor(query => query.TenantId).NotEmpty();
        RuleFor(query => query.PageNumber).GreaterThan(0);
        RuleFor(query => query.PageSize).InclusiveBetween(1, 100);
        RuleFor(query => query.Status).IsInEnum().When(query => query.Status.HasValue);
        RuleFor(query => query.Stock).IsInEnum();
        RuleFor(query => query.SortBy).IsInEnum();
    }
}
