using System.ComponentModel.DataAnnotations;

namespace Siuden.Api.Contracts.Common;

/// <summary>
/// Request model for pagination parameters.
/// </summary>
public class PaginationRequest
{
    /// <summary>
    /// Gets or sets the page number (1-based). Default is 1.
    /// </summary>
    [Range(1, int.MaxValue, ErrorMessage = "Page number must be greater than 0.")]
    public int PageNumber { get; set; } = 1;

    /// <summary>
    /// Gets or sets the page size. Default is 10, maximum is 100.
    /// </summary>
    [Range(1, 100, ErrorMessage = "Page size must be between 1 and 100.")]
    public int PageSize { get; set; } = 10;
}
