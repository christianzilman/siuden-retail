using Mapster;
using Siuden.Application.Features.Categories.Commands;
using Siuden.Application.Features.Categories.DTOs;
using Siuden.Application.Interfaces;
using Siuden.Domain.Entities;
using Siuden.Domain.Repositories;

namespace Siuden.Infrastructure.Services;

public class CategoryService(ICategoryRepository categoryRepository, ITenantRepository tenantRepository) : ICategoryService
{
    public async Task<ICollection<CategoryDto>> GetAllByTenant(string tenantSlug, CancellationToken cancellationToken)
    {
        var tenant = await GetActiveTenantAsync(
        tenantSlug,
        cancellationToken);

        var categories = await categoryRepository.GetAllAsync(
            tenant.Id,
            cancellationToken);

        return BuildTree(categories);
    }

    public async Task<CategoryDto> CreateAsync(
        CreateCategoryCommand command,
        CancellationToken cancellationToken = default)
    {
        var tenant = await GetActiveTenantAsync(command.TenantSlug, cancellationToken);

        if (await categoryRepository.ExistsBySlugAsync(
                tenant.Id,
                command.Slug,
                cancellationToken: cancellationToken))
        {
            throw new InvalidOperationException(
                $"Ya existe una categoría con el slug '{command.Slug}'.");
        }

        if (command.ParentId.HasValue)
        {
            var parent = await categoryRepository.GetByIdAsync(
                tenant.Id,
                command.ParentId.Value,
                cancellationToken);

            if (parent is null)
            {
                throw new KeyNotFoundException(
                    "La categoría padre no existe.");
            }
        }

        var category = new Category
        {
            Id = Guid.NewGuid(),
            TenantId = tenant.Id,
            ParentId = command.ParentId,
            Name = command.Name.Trim(),
            Slug = command.Slug.Trim().ToLowerInvariant(),
            Description = command.Description.Trim(),
            SortOrder = command.SortOrder,
            IsVisible = command.IsVisible
        };

        await categoryRepository.AddAsync(
            category,
            cancellationToken);

        return category.Adapt<CategoryDto>();
    }

    public async Task<CategoryDto> UpdateAsync(
        UpdateCategoryCommand command,
        CancellationToken cancellationToken = default)
    {
        var tenant = await GetActiveTenantAsync(command.TenantSlug, cancellationToken);

        var category = await categoryRepository.GetByIdAsync(
            tenant.Id,
            command.Id,
            cancellationToken);

        if (category is null)
        {
            throw new KeyNotFoundException(
                "La categoría no existe.");
        }

        if (await categoryRepository.ExistsBySlugAsync(
                tenant.Id,
                command.Slug,
                category.Id,
                cancellationToken))
        {
            throw new InvalidOperationException(
                $"Ya existe una categoría con el slug '{command.Slug}'.");
        }

        await ValidateParentAsync(
            tenant.Id,
            category.Id,
            command.ParentId,
            cancellationToken);

        category.ParentId = command.ParentId;
        category.Name = command.Name.Trim();
        category.Slug = command.Slug.Trim().ToLowerInvariant();
        category.Description = command.Description.Trim();
        category.SortOrder = command.SortOrder;
        category.IsVisible = command.IsVisible;

        await categoryRepository.UpdateAsync(category, cancellationToken);

        return category.Adapt<CategoryDto>();
    }

    public async Task RemoveAsync(
        RemoveCategoryCommand command,
        CancellationToken cancellationToken = default)
    {
        var tenant = await GetActiveTenantAsync(command.TenantSlug, cancellationToken);

        var category = await categoryRepository.GetByIdAsync(
            tenant.Id,
            command.Id,
            cancellationToken);

        if (category is null)
        {
            throw new KeyNotFoundException(
                "La categoría no existe.");
        }

        // Soft remove para este MVP.
        category.IsVisible = false;

        await categoryRepository.UpdateAsync(category, cancellationToken);
    }

    public async Task<ICollection<CategoryDto>> ReorderAsync(
        ReorderCategoriesCommand command,
        CancellationToken cancellationToken = default)
    {
        var tenant = await GetActiveTenantAsync(command.TenantSlug, cancellationToken);

        var categories = await categoryRepository.GetAllAsync(
            tenant.Id,
            cancellationToken);

        var categoryMap = categories.ToDictionary(x => x.Id);

        foreach (var item in command.Items)
        {
            if (!categoryMap.TryGetValue(item.Id, out var category))
            {
                throw new KeyNotFoundException(
                    $"La categoría '{item.Id}' no existe.");
            }

            if (item.ParentId.HasValue &&
                !categoryMap.ContainsKey(item.ParentId.Value))
            {
                throw new KeyNotFoundException(
                    $"La categoría padre '{item.ParentId}' no existe.");
            }

            category.ParentId = item.ParentId;
            category.SortOrder = item.SortOrder;
        }

        ValidateNoCycles(categoryMap.Values);

        await categoryRepository.UpdateRangeAsync(categoryMap.Values, cancellationToken);

        return BuildTree(categoryMap.Values);
    }

    private async Task<Tenant> GetActiveTenantAsync(string tenantSlug, CancellationToken cancellationToken)
    {
        var tenant = await tenantRepository.GetActiveBySlugAsync(
            tenantSlug,
            cancellationToken);

        if (tenant is null)
        {
            throw new KeyNotFoundException(
                $"El tenant '{tenantSlug}' no existe o no está activo.");
        }

        return tenant;
    }

    private async Task ValidateParentAsync(
        Guid tenantId,
        Guid categoryId,
        Guid? parentId,
        CancellationToken cancellationToken)
    {
        if (!parentId.HasValue)
            return;

        if (parentId.Value == categoryId)
        {
            throw new InvalidOperationException(
                "Una categoría no puede ser padre de sí misma.");
        }

        var categories = await categoryRepository.GetAllAsync(
            tenantId,
            cancellationToken);

        var map = categories.ToDictionary(x => x.Id);

        if (!map.ContainsKey(parentId.Value))
        {
            throw new KeyNotFoundException(
                "La categoría padre no existe.");
        }

        var currentId = parentId;

        while (currentId.HasValue)
        {
            if (currentId.Value == categoryId)
            {
                throw new InvalidOperationException(
                    "La categoría padre generaría una referencia circular.");
            }

            if (!map.TryGetValue(currentId.Value, out var current))
                break;

            currentId = current.ParentId;
        }
    }

    private static void ValidateNoCycles(
        IEnumerable<Category> categories)
    {
        var map = categories.ToDictionary(x => x.Id);

        foreach (var category in map.Values)
        {
            var visited = new HashSet<Guid>();

            Guid? currentId = category.Id;

            while (currentId.HasValue)
            {
                if (!visited.Add(currentId.Value))
                {
                    throw new InvalidOperationException(
                        "La jerarquía de categorías contiene una referencia circular.");
                }

                if (!map.TryGetValue(currentId.Value, out var current))
                    break;

                currentId = current.ParentId;
            }
        }
    }

    private static ICollection<CategoryDto> BuildTree(
        IEnumerable<Category> categories)
    {
        var ordered = categories
            .OrderBy(x => x.SortOrder)
            .ThenBy(x => x.Name)
            .ToList();

        var dtoMap = ordered.ToDictionary(
            x => x.Id,
            x => x.Adapt<CategoryDto>());

        var roots = new List<CategoryDto>();

        foreach (var category in ordered)
        {
            var dto = dtoMap[category.Id];

            if (category.ParentId.HasValue &&
                dtoMap.TryGetValue(category.ParentId.Value, out var parent))
            {
                parent.Children.Add(dto);
            }
            else
            {
                roots.Add(dto);
            }
        }

        return roots;
    }
}
