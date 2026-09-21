using MediatR;
using Siuden.Application.Features.Categories.Commands;
using Siuden.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Categories.Handlers;

public sealed class RemoveCategoryCommandHandler(
    ICategoryService categoryService)
    : IRequestHandler<RemoveCategoryCommand>
{
    public async Task Handle(
        RemoveCategoryCommand request,
        CancellationToken cancellationToken)
    {
        await categoryService.RemoveAsync(
            request,
            cancellationToken);
    }
}
