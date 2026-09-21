using Siuden.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Domain.Repositories;

public interface ICategoryRepository : IAsyncRepository<Category, Guid>
{
    Task<Category?> GetByIdAsync(
        Guid tenantId,
        Guid id,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsBySlugAsync(
        Guid tenantId,
        string slug,
        Guid? excludeId = null,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<Category>> GetAllAsync(
        Guid tenantId,
        CancellationToken cancellationToken = default);

    Task UpdateRangeAsync(
        IEnumerable<Category> categories,
        CancellationToken cancellationToken = default);
}
