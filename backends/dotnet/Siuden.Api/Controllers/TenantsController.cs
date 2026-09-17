using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Siuden.Application.Features.Tenants.DTOs;
using Siuden.Application.Features.Tenants.Queries;

namespace Siuden.Api.Controllers;

[ApiController]
[Route("api/tenants")]
public sealed class TenantsController(IMediator mediator) : ControllerBase
{
    [AllowAnonymous]
    [HttpGet("{tenantSlug}")]
    [ProducesResponseType(typeof(PublicTenantDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PublicTenantDto>> GetPublic(
        string tenantSlug,
        CancellationToken cancellationToken)
    {
        return Ok(await mediator.Send(
            new GetPublicTenantQuery(tenantSlug),
            cancellationToken));
    }
}
