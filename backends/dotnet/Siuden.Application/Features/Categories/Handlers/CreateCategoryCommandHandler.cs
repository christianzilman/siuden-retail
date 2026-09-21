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

public sealed class CreateCategoryCommandHandler(
    ICategoryService categoryService)
    : IRequestHandler<CreateCategoryCommand, CategoryDto>
{
    public Task<CategoryDto> Handle(
        CreateCategoryCommand request,
        CancellationToken cancellationToken)
    {
        return categoryService.CreateAsync(
            request,
            cancellationToken);
    }
}
