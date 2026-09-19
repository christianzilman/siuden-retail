using Siuden.Application.DTOs;
using Siuden.Application.Features.Products.DTOs;
using Siuden.Application.Features.Products.Repositories;
using Siuden.Application.Interfaces;
using Siuden.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Infrastructure.Services;

public class ProductService(IProductReadRepository productReadRepository) : IProductService
{
    public async Task<PagedResult<ProductListItemDto>> GetPagedAsync(ProductSearchCriteria productSearchCriteria, CancellationToken cancellationToken = default)
    {
        return await productReadRepository.GetPagedAsync(productSearchCriteria, cancellationToken);
    }
}
