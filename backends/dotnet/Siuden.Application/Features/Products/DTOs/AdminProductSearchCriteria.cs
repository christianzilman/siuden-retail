using Siuden.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Products.DTOs;

public record AdminProductSearchCriteria(
    Guid TenantId,
    string? Name,
    string? Sku,
    Guid? CategoryId,
    ProductStatusEnum? Status,
    ProductStockFilter Stock,
    ProductSortBy SortBy,
    int PageNumber,
    int PageSize);

