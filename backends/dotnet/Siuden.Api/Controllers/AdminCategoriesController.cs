using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Siuden.Api.Contracts.Categories;
using Siuden.Api.Security;
using Siuden.Application.Common.Security;
using Siuden.Application.Features.Categories.Commands;
using Siuden.Application.Features.Categories.DTOs;
using Siuden.Domain.Constants;

namespace Siuden.Api.Controllers;

[ApiController]
[Authorize(Roles = $"{GlobalRoles.Owner},{GlobalRoles.Admin}")]
[Route("api/admin/categories")]
public class AdminCategoriesController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<CategoryDto>> Create(
        [FromBody] CreateCategoryRequest request,
        CancellationToken cancellationToken)
    {
        var command = new CreateCategoryCommand(
            User.GetRequiredGuid(AuthClaimTypes.TenantId), request.ParentId, request.Name,
            request.Slug, request.Description, request.SortOrder, request.IsVisible);
        return StatusCode(StatusCodes.Status201Created, await mediator.Send(command, cancellationToken));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CategoryDto>> Update(Guid id, [FromBody] UpdateCategoryRequest request, CancellationToken cancellationToken)
    {
        var command = new UpdateCategoryCommand(
            User.GetRequiredGuid(AuthClaimTypes.TenantId), id, request.ParentId, request.Name,
            request.Slug, request.Description, request.SortOrder, request.IsVisible);
        return Ok(await mediator.Send(command, cancellationToken));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Remove(Guid id, CancellationToken cancellationToken)
    {
        await mediator.Send(new RemoveCategoryCommand(User.GetRequiredGuid(AuthClaimTypes.TenantId), id), cancellationToken);
        return NoContent();
    }

    [HttpPost("reorder")]
    public async Task<ActionResult<ICollection<CategoryDto>>> Reorder(
        [FromBody] ICollection<ReorderCategoryRequest> request, CancellationToken cancellationToken)
    {
        var items = request.Select(x => new ReorderCategoryItem(x.Id, x.ParentId, x.SortOrder)).ToList();
        var command = new ReorderCategoriesCommand(User.GetRequiredGuid(AuthClaimTypes.TenantId), items);
        return Ok(await mediator.Send(command, cancellationToken));
    }
}
