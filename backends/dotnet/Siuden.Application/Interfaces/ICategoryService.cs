using Siuden.Application.Features.Categories.Commands;
using Siuden.Application.Features.Categories.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Interfaces;

public interface ICategoryService
{
    Task<ICollection<CategoryDto>> GetAllByTenant(string tenantSlug, 
        CancellationToken cancellationToken);

    Task<CategoryDto> CreateAsync(
        CreateCategoryCommand command,
        CancellationToken cancellationToken = default);

    Task<CategoryDto> UpdateAsync(
        UpdateCategoryCommand command,
        CancellationToken cancellationToken = default);

    Task RemoveAsync(
        RemoveCategoryCommand command,
        CancellationToken cancellationToken = default);

    Task<ICollection<CategoryDto>> ReorderAsync(
        ReorderCategoriesCommand command,
        CancellationToken cancellationToken = default);
}
