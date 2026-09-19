using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Products.DTOs;

public record ProductSearchCriteria(
    string TenantSlug,
    Guid? CategoryId,
    ProductSortBy SortBy,
    int PageNumber,
    int PageSize);
