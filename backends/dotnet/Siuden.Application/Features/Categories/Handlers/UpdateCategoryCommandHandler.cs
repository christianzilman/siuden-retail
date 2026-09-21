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

public sealed class UpdateCategoryCommandHandler(
    ICategoryService categoryService)
    : IRequestHandler<UpdateCategoryCommand, CategoryDto>
{
    public Task<CategoryDto> Handle(
        UpdateCategoryCommand request,
        CancellationToken cancellationToken)
    {
        return categoryService.UpdateAsync(
            request,
            cancellationToken);
    }
}
