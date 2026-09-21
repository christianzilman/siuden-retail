namespace Siuden.Api.Contracts.Categories;

public record UpdateCategoryRequest(
    Guid? ParentId,
    string Name,
    string Slug,
    string Description,
    int SortOrder,
    bool IsVisible
);
