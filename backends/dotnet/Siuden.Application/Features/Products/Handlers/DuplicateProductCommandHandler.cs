using MediatR;
using Siuden.Application.Features.Products.Commands;
using Siuden.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Siuden.Application.Interfaces.IProductService;

namespace Siuden.Application.Features.Products.Handlers;

public class DuplicateProductCommandHandler(
    IProductService productService)
    : IRequestHandler<DuplicateProductCommand, long>
{
    public async Task<long> Handle(
        DuplicateProductCommand request,
        CancellationToken cancellationToken)
    {
        return await productService.DuplicateAsync(
            request.TenantId,
            request.ProductId,
            cancellationToken);
    }
}
