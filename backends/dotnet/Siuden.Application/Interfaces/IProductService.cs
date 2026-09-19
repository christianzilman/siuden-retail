using Siuden.Application.DTOs;
using Siuden.Application.Features.Products.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Interfaces;

public interface IProductService
{
    Task<PagedResult<ProductListItemDto>> GetPagedAsync(ProductSearchCriteria productSearchCriteria, CancellationToken cancellationToken = default);
}
