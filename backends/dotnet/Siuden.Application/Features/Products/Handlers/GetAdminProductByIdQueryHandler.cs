using MediatR;
using Siuden.Application.Common.Exceptions;
using Siuden.Application.Features.Products.DTOs;
using Siuden.Application.Features.Products.Queries;
using Siuden.Application.Interfaces;

namespace Siuden.Application.Features.Products.Handlers;

public sealed class GetAdminProductByIdQueryHandler(
    IProductService productService)
    : IRequestHandler<GetAdminProductByIdQuery, AdminProductDetailDto>
{
    public async Task<AdminProductDetailDto> Handle(
        GetAdminProductByIdQuery request,
        CancellationToken cancellationToken)
    {
        return await productService.GetAdminByIdAsync(
            request.TenantId,
            request.ProductId,
            cancellationToken)
            ?? throw new NotFoundException("Product not found.");
    }
}
