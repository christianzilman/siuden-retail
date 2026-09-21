namespace Siuden.Api.Contracts.Categories;

public record CreateCategoryRequest(
    Guid? ParentId,
    string Name,
    string Slug,
    string Description,
    int SortOrder,
    bool IsVisible
);
