using MediatR;
using Siuden.Application.Features.Categories.DTOs;
using Siuden.Application.Features.Categories.Queries;
using Siuden.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Categories.Handlers;

public class GetAllCategoriesQueryHandler(ICategoryService categoryService) : IRequestHandler<GetAllCategoriesQuery, ICollection<CategoryDto>>
{
    public async Task<ICollection<CategoryDto>> Handle(GetAllCategoriesQuery request, CancellationToken cancellationToken)
    {
        return await categoryService.GetAllByTenant(request.TenantSlug);
    }
}
