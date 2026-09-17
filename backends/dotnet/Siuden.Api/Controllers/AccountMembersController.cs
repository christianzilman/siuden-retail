using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Siuden.Api.Contracts.AccountMembers;
using Siuden.Api.Security;
using Siuden.Application.Common.Security;
using Siuden.Application.Features.AccountMembers.Commands;
using Siuden.Application.Features.AccountMembers.DTOs;
using Siuden.Application.Features.AccountMembers.Queries;
using Siuden.Domain.Constants;
using System.Security.Claims;

namespace Siuden.Api.Controllers;

[ApiController]
[Authorize(Roles = $"{GlobalRoles.Owner},{GlobalRoles.Admin}")]
[Route("api/account-members")]
public sealed class AccountMembersController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(
        typeof(IReadOnlyCollection<AccountMemberDto>),
        StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyCollection<AccountMemberDto>>> GetAll(
        CancellationToken cancellationToken)
    {
        var members = await mediator.Send(new GetAccountMembersQuery(
            User.GetRequiredGuid(ClaimTypes.NameIdentifier),
            User.GetRequiredGuid(AuthClaimTypes.AccountId)),
            cancellationToken);

        return Ok(members);
    }

    [HttpPost]
    [ProducesResponseType(typeof(AccountMemberDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AccountMemberDto>> Create(
        [FromBody] CreateAccountMemberRequest request,
        CancellationToken cancellationToken)
    {
        var member = await mediator.Send(new CreateAccountMemberCommand
        {
            RequesterUserId = User.GetRequiredGuid(ClaimTypes.NameIdentifier),
            AccountId = User.GetRequiredGuid(AuthClaimTypes.AccountId),
            TenantId = User.GetRequiredGuid(AuthClaimTypes.TenantId),
            Email = request.Email,
            RoleCode = request.RoleCode,
            TemporaryPassword = request.TemporaryPassword
        }, cancellationToken);

        return StatusCode(StatusCodes.Status201Created, member);
    }

    [HttpPatch("{memberId:guid}")]
    [ProducesResponseType(typeof(AccountMemberDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AccountMemberDto>> Update(
        Guid memberId,
        [FromBody] UpdateAccountMemberRequest request,
        CancellationToken cancellationToken)
    {
        var member = await mediator.Send(new UpdateAccountMemberCommand
        {
            RequesterUserId = User.GetRequiredGuid(ClaimTypes.NameIdentifier),
            AccountId = User.GetRequiredGuid(AuthClaimTypes.AccountId),
            MemberId = memberId,
            RoleCode = request.RoleCode,
            Status = request.Status
        }, cancellationToken);

        return Ok(member);
    }
}
