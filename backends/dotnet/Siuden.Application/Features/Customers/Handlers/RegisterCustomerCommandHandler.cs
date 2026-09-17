using MediatR;
using Siuden.Application.Features.Customers.Commands;
using Siuden.Application.Features.Customers.DTOs;
using Siuden.Application.Interfaces;

namespace Siuden.Application.Features.Customers.Handlers;

public sealed class RegisterCustomerCommandHandler(ICustomerRegistrationService registrationService)
    : IRequestHandler<RegisterCustomerCommand, CustomerDto>
{
    public Task<CustomerDto> Handle(RegisterCustomerCommand request, CancellationToken cancellationToken)
    {
        return registrationService.RegisterAsync(request, cancellationToken);
    }
}
