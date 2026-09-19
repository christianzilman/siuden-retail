using Siuden.Api.Contracts.Common;
using Siuden.Application.DTOs;

namespace Siuden.Api.Mappings;

public static class PagedResultExtensions
{
    public static PagedResponse<T> ToResponse<T>(
        this PagedResult<T> result)
    {
        return new PagedResponse<T>
        {
            Items = result.Items,
            PageNumber = result.PageNumber,
            PageSize = result.PageSize,
            TotalCount = result.TotalCount,
            TotalPages = result.TotalPages,
            HasPreviousPage = result.HasPreviousPage,
            HasNextPage = result.HasNextPage
        };
    }
}