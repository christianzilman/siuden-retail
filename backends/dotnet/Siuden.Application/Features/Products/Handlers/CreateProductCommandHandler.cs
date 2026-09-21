using MediatR;
using Siuden.Application.Features.Products.Commands;
using Siuden.Application.Interfaces;

namespace Siuden.Application.Features.Products.Handlers;

public class CreateProductCommandHandler(
    IProductService productService)
    : IRequestHandler<CreateProductCommand, long>
{
    public async Task<long> Handle(
        CreateProductCommand request,
        CancellationToken cancellationToken)
    {
        return await productService.CreateAsync(
            request.Product,
            cancellationToken);
    }
}
