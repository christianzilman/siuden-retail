using MediatR;
using Siuden.Application.Features.Categories.DTOs;

namespace Siuden.Application.Features.Categories.Commands;

public record UpdateCategoryCommand(
    string TenantSlug,
    Guid Id,
    Guid? ParentId,
    string Name,
    string Slug,
    string Description,
    int SortOrder,
    bool IsVisible
) : IRequest<CategoryDto>;
