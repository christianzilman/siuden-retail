using Siuden.Application.Features.Customers.Commands;
using Siuden.Application.Features.Customers.DTOs;

namespace Siuden.Application.Interfaces;

public interface ICustomerRegistrationService
{
    Task<CustomerDto> RegisterAsync(RegisterCustomerCommand command, CancellationToken cancellationToken);
}
