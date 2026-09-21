using MediatR;
using Siuden.Application.Features.Categories.Commands;
using Siuden.Application.Features.Categories.DTOs;
using Siuden.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Categories.Handlers;

public sealed class ReorderCategoriesCommandHandler(
    ICategoryService categoryService)
    : IRequestHandler<ReorderCategoriesCommand, ICollection<CategoryDto>>
{
    public Task<ICollection<CategoryDto>> Handle(
        ReorderCategoriesCommand request,
        CancellationToken cancellationToken)
    {
        return categoryService.ReorderAsync(
            request,
            cancellationToken);
    }
}
