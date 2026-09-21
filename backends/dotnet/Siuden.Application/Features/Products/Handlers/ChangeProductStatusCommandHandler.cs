using MediatR;
using Siuden.Application.Features.Products.Commands;
using Siuden.Application.Interfaces;

namespace Siuden.Application.Features.Products.Handlers;

public class ChangeProductStatusCommandHandler(
    IProductService productService)
    : IRequestHandler<ChangeProductStatusCommand>
{
    public async Task Handle(
        ChangeProductStatusCommand request,
        CancellationToken cancellationToken)
    {
        await productService.ChangeStatusAsync(
            request.TenantId,
            request.ProductId,
            request.Status,
            cancellationToken);
    }
}
