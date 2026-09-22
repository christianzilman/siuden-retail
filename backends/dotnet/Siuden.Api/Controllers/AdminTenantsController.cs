using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Siuden.Api.Contracts.Tenants;
using Siuden.Api.Security;
using Siuden.Application.Common.Security;
using Siuden.Application.Features.Tenants.Commands;
using Siuden.Application.Features.Tenants.DTOs;
using Siuden.Application.Features.Tenants.Queries;
using Siuden.Domain.Constants;

namespace Siuden.Api.Controllers;

[ApiController]
[Authorize(Roles = $"{GlobalRoles.Owner},{GlobalRoles.Admin}")]
[Route("api/admin/tenants")]
public sealed class AdminTenantsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PublicTenantDto>> Get(CancellationToken cancellationToken) =>
        Ok(await mediator.Send(
            new GetAdminTenantQuery(User.GetRequiredGuid(AuthClaimTypes.TenantId)),
            cancellationToken));

    [HttpPut]
    public async Task<ActionResult<PublicTenantDto>> Update(
        [FromBody] UpdateTenantSettingsRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateTenantSettingsCommand(
            User.GetRequiredGuid(AuthClaimTypes.TenantId),
            request.BrandName, request.ContactEmail, request.Phone,
            request.AddressLine, request.AddressNumber, request.City,
            request.Province, request.PostalCode, request.CountryCode,
            request.PrimaryColor, request.SecondaryColor, request.BackgroundColor,
            request.TextColor, request.HeadingFont, request.BodyFont,
            request.BorderRadius, request.AnnouncementEnabled,
            request.AnnouncementText, request.AnnouncementUrl,
            request.FaviconUrl, request.LogoUrl);

        return Ok(await mediator.Send(command, cancellationToken));
    }
}
