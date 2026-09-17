using Siuden.Domain.Entities;

namespace Siuden.Domain.Repositories;

public interface ICustomerRepository : IAsyncRepository<Customer, Guid>
{
}
