using Siuden.Application.Features.Categories.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Interfaces;

public interface ICategoryService
{
    public Task<ICollection<CategoryDto>> GetAllByTenant(string tenantSlug);
}
