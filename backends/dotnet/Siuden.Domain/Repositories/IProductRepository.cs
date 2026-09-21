using Siuden.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Domain.Repositories;

public interface IProductRepository : IAsyncRepository<Product, long>
{
    Task<Product?> GetAggregateAsync(Guid tenantId, long productId, CancellationToken cancellationToken);
    Task<bool> SlugExistsAsync(
        Guid tenantId,
        string slug,
        long? excludingProductId,
        CancellationToken cancellationToken);
}
