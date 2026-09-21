using MediatR;
using Siuden.Application.Features.Categories.DTOs;

namespace Siuden.Application.Features.Categories.Commands;

public record CreateCategoryCommand(
    Guid TenantId,
    Guid? ParentId,
    string Name,
    string Slug,
    string Description,
    int SortOrder,
    bool IsVisible) : IRequest<CategoryDto>;
