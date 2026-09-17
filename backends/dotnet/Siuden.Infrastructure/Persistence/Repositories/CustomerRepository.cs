using Siuden.Domain.Entities;
using Siuden.Domain.Repositories;

namespace Siuden.Infrastructure.Persistence.Repositories;

public sealed class CustomerRepository
    : RepositoryBase<Customer, Guid>, ICustomerRepository
{
    public CustomerRepository(SiudenRetailDbContext context)
        : base(context)
    {
    }
}
