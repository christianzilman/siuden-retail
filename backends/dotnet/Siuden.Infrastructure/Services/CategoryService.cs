using Mapster;
using Siuden.Application.Features.Categories.DTOs;
using Siuden.Application.Interfaces;
using Siuden.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Infrastructure.Services;

public class CategoryService(ICategoryRepository categoryRepository) : ICategoryService
{
    public async Task<ICollection<CategoryDto>> GetAllByTenant(string tenantSlug)
    {
        var categories = await categoryRepository.GetAllByTenant(tenantSlug);

        return categories
            .Select(p => p.Adapt<CategoryDto>())
            .ToList();
    }
}
