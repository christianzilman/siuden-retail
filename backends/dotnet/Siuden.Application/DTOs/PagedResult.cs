using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.DTOs;


/// <summary>
/// Represents a paged result with items and pagination metadata.
/// </summary>
/// <typeparam name="T">The type of items in the result.</typeparam>
public class PagedResult<T>
{
    /// <summary>
    /// Gets the items in the current page.
    /// </summary>
    public IEnumerable<T> Items { get; init; }

    /// <summary>
    /// Gets the current page number (1-based).
    /// </summary>
    public int PageNumber { get; init; }

    /// <summary>
    /// Gets the page size.
    /// </summary>
    public int PageSize { get; init; }

    /// <summary>
    /// Gets the total number of items across all pages.
    /// </summary>
    public int TotalCount { get; init; }

    /// <summary>
    /// Gets the total number of pages.
    /// </summary>
    public int TotalPages { get; init; }

    /// <summary>
    /// Gets a value indicating whether there is a previous page.
    /// </summary>
    public bool HasPreviousPage => PageNumber > 1;

    /// <summary>
    /// Gets a value indicating whether there is a next page.
    /// </summary>
    public bool HasNextPage => PageNumber < TotalPages;

    /// <summary>
    /// Gets a value indicating whether the result is empty.
    /// </summary>
    public bool IsEmpty => Items == null || !Items.Any();

    public PagedResult()
    {
        Items = Enumerable.Empty<T>();
        PageNumber = 1;
        PageSize = 10;
        TotalCount = 0;
        TotalPages = 0;
    }

    public PagedResult(IEnumerable<T> items, int pageNumber, int pageSize, int totalCount)
    {
        Items = items ?? Enumerable.Empty<T>();
        PageNumber = pageNumber;
        PageSize = pageSize;
        TotalCount = totalCount;
        TotalPages = pageSize > 0 ? (int)Math.Ceiling(totalCount / (double)pageSize) : 0;
    }

    /// <summary>
    /// Creates a paged result.
    /// </summary>
    public static PagedResult<T> Create(IEnumerable<T> items, int pageNumber, int pageSize, int totalCount)
        => new(items, pageNumber, pageSize, totalCount);

    /// <summary>
    /// Creates an empty paged result.
    /// </summary>
    public static PagedResult<T> Empty() => new();

    /// <summary>
    /// Maps the items to a different type.
    /// </summary>
    public PagedResult<TResult> Map<TResult>(Func<T, TResult> mapper)
    {
        var mappedItems = Items.Select(mapper);
        return new PagedResult<TResult>(mappedItems, PageNumber, PageSize, TotalCount);
    }
}
