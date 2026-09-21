using FluentValidation;
using Siuden.Application.Features.Products.Queries;

namespace Siuden.Application.Validators.Products;

public sealed class GetAdminProductByIdQueryValidator
    : AbstractValidator<GetAdminProductByIdQuery>
{
    public GetAdminProductByIdQueryValidator()
    {
        RuleFor(query => query.TenantId).NotEmpty();
        RuleFor(query => query.ProductId).GreaterThan(0);
    }
}
