using MediatR;
using Siuden.Application.Features.Products.Commands;
using Siuden.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Products.Handlers;

public class UpdateProductCommandHandler(
    IProductService productService)
    : IRequestHandler<UpdateProductCommand>
{
    public async Task Handle(
        UpdateProductCommand request,
        CancellationToken cancellationToken)
    {
        await productService.UpdateAsync(
            request.ProductId,
            request.Product,
            cancellationToken);
    }
}
