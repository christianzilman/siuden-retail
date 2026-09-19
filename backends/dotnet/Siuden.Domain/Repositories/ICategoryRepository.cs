using Siuden.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Domain.Repositories;

public interface ICategoryRepository : IAsyncRepository<Category, Guid>
{
    Task<ICollection<Category>> GetAllByTenant(string tenantSlug);
}
