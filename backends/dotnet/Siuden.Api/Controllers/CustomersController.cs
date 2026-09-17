using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Siuden.Api.Contracts.Customers;
using Siuden.Application.Features.Customers.Commands;
using Siuden.Application.Features.Customers.DTOs;

namespace Siuden.Api.Controllers;

[ApiController]
[Route("api/tenants/{tenantSlug}/customers")]
public sealed class CustomersController(IMediator mediator) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost]
    [ProducesResponseType(typeof(CustomerDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<CustomerDto>> Register(
        string tenantSlug,
        [FromBody] RegisterCustomerRequest request,
        CancellationToken cancellationToken)
    {
        var customer = await mediator.Send(new RegisterCustomerCommand
        {
            TenantSlug = tenantSlug,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Phone = request.Phone,
            Password = request.Password,
            PasswordConfirmation = request.PasswordConfirmation
        }, cancellationToken);

        return StatusCode(StatusCodes.Status201Created, customer);
    }
}
