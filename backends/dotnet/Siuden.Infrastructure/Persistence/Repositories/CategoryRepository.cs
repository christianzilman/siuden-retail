using Microsoft.EntityFrameworkCore;
using Siuden.Domain.Entities;
using Siuden.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Infrastructure.Persistence.Repositories;

public class CategoryRepository : RepositoryBase<Category, Guid>, ICategoryRepository
{
    public CategoryRepository(SiudenRetailDbContext context) : base(context)
    {
    }

    public async Task<ICollection<Category>> GetAllByTenant(string tenantSlug)
    {
        return await Context.Categories
            .Include(p => p.Tenant)
            .Include( p => p.Children)
            .Where(p => p.Tenant.Slug == tenantSlug)
            .ToListAsync();
    }
}
