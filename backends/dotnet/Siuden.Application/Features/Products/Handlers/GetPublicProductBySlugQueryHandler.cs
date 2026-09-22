using MediatR;
using Siuden.Application.Common.Exceptions;
using Siuden.Application.Features.Products.DTOs;
using Siuden.Application.Features.Products.Queries;
using Siuden.Application.Interfaces;

namespace Siuden.Application.Features.Products.Handlers;

public sealed class GetPublicProductBySlugQueryHandler(IProductService productService)
    : IRequestHandler<GetPublicProductBySlugQuery, PublicProductDetailDto>
{
    public async Task<PublicProductDetailDto> Handle(
        GetPublicProductBySlugQuery request,
        CancellationToken cancellationToken)
    {
        return await productService.GetPublicBySlugAsync(
            request.TenantSlug,
            request.ProductSlug,
            cancellationToken)
            ?? throw new NotFoundException("Product not found.");
    }
}
