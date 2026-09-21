namespace Siuden.Api.Contracts.Categories;

public record ReorderCategoryRequest(
    Guid Id,
    Guid? ParentId,
    int SortOrder
);
