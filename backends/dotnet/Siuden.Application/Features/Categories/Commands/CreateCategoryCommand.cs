using MediatR;
using Siuden.Application.Features.Categories.DTOs;

namespace Siuden.Application.Features.Categories.Commands;

public record CreateCategoryCommand(
    string TenantSlug,
    Guid? ParentId,
    string Name,
    string Slug,
    string Description,
    int SortOrder,
    bool IsVisible) : IRequest<CategoryDto>;
