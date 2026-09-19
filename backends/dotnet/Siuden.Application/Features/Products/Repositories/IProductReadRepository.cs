using Siuden.Application.DTOs;
using Siuden.Application.Features.Products.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Products.Repositories;

public interface IProductReadRepository
{
    Task<PagedResult<ProductListItemDto>> GetPagedAsync(
        ProductSearchCriteria criteria,
        CancellationToken cancellationToken = default);
}
