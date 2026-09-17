using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Siuden.Api.Contracts.Auths;
using Siuden.Application.Common.Exceptions;
using Siuden.Application.Common.Security;
using Siuden.Application.Features.Auth.Commands;
using Siuden.Application.Features.Auth.DTOs;

namespace Siuden.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(
    IMediator mediator,
    IWebHostEnvironment environment) : ControllerBase
{
    private const string RefreshCookieName = "siuden_refresh_token";

    [AllowAnonymous]
    [HttpPost("/api/tenants/{tenantSlug}/auth/staff/login")]
    [ProducesResponseType(typeof(LoginResultDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<LoginResultDto>> LoginStaff(
        string tenantSlug,
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new LoginCommand
        {
            TenantSlug = tenantSlug,
            Email = request.Email,
            Password = request.Password
        }, cancellationToken);
        SetRefreshCookie(result);
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("/api/tenants/{tenantSlug}/auth/customer/login")]
    [ProducesResponseType(typeof(LoginResultDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<LoginResultDto>> LoginCustomer(
        string tenantSlug,
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new CustomerLoginCommand
        {
            TenantSlug = tenantSlug,
            Email = request.Email,
            Password = request.Password
        }, cancellationToken);

        SetRefreshCookie(result);
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(LoginResultDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<LoginResultDto>> Refresh(
        CancellationToken cancellationToken)
    {
        if (!Request.Cookies.TryGetValue(RefreshCookieName, out var refreshToken) ||
            string.IsNullOrWhiteSpace(refreshToken))
        {
            throw new UnauthorizedException("Falta el refresh token");
        }

        var result = await mediator.Send(
            new RefreshCommand(refreshToken),
            cancellationToken);

        SetRefreshCookie(result);
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        if (Request.Cookies.TryGetValue(RefreshCookieName, out var refreshToken) &&
            !string.IsNullOrWhiteSpace(refreshToken))
        {
            await mediator.Send(new LogoutCommand(refreshToken), cancellationToken);
        }

        Response.Cookies.Delete(RefreshCookieName, new CookieOptions { Path = "/api" });
        return NoContent();
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        return Ok(new
        {
            userId = User.FindFirstValue(ClaimTypes.NameIdentifier),
            email = User.FindFirstValue(ClaimTypes.Email),
            role = User.FindFirstValue(ClaimTypes.Role),
            accountId = User.FindFirstValue(AuthClaimTypes.AccountId),
            tenantId = User.FindFirstValue(AuthClaimTypes.TenantId),
            customerId = User.FindFirstValue(AuthClaimTypes.CustomerId),
            permissions = User.FindAll(AuthClaimTypes.Permission).Select(claim => claim.Value)
        });
    }

    private void SetRefreshCookie(LoginResultDto result)
    {
        Response.Cookies.Append(
            RefreshCookieName,
            result.RefreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = !environment.IsDevelopment(),
                SameSite = SameSiteMode.Lax,
                Path = "/api",
                Expires = result.RefreshTokenExpiresAtUtc
            });
    }
}
