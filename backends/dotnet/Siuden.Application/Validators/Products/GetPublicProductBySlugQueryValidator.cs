using FluentValidation;
using Siuden.Application.Features.Products.Queries;

namespace Siuden.Application.Validators.Products;

public sealed class GetPublicProductBySlugQueryValidator
    : AbstractValidator<GetPublicProductBySlugQuery>
{
    public GetPublicProductBySlugQueryValidator()
    {
        RuleFor(x => x.TenantSlug).NotEmpty().MaximumLength(100);
        RuleFor(x => x.ProductSlug).NotEmpty().MaximumLength(200);
    }
}
