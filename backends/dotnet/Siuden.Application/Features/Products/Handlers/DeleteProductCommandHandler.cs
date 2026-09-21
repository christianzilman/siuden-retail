using MediatR;
using Siuden.Application.Features.Products.Commands;
using Siuden.Application.Interfaces;

namespace Siuden.Application.Features.Products.Handlers;

public class DeleteProductCommandHandler(
    IProductService productService)
    : IRequestHandler<DeleteProductCommand>
{
    public async Task Handle(
        DeleteProductCommand request,
        CancellationToken cancellationToken)
    {
        await productService.DeleteAsync(
            request.TenantId,
            request.ProductId,
            cancellationToken);
    }
}
