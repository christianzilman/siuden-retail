using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Siuden.Api.Contracts.Categories;
using Siuden.Application.Features.Categories.Commands;
using Siuden.Application.Features.Categories.DTOs;
using Siuden.Application.Features.Categories.Queries;

namespace Siuden.Api.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController(IMediator mediator) : ControllerBase
{

    [HttpGet("{tenantSlug}")]
    [ProducesResponseType(typeof(ICollection<CategoryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ICollection<CategoryDto>>> GetAll([FromRoute] string tenantSlug,
        CancellationToken cancellationToken)
    {
        var request = new GetAllCategoriesQuery(tenantSlug);
        var result = await mediator.Send(request, cancellationToken);

        return Ok(result);
    }

    [HttpPost("{tenantSlug}")]
    [ProducesResponseType(typeof(CategoryDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<CategoryDto>> Create(
        [FromRoute] string tenantSlug,
        [FromBody] CreateCategoryRequest request,
        CancellationToken cancellationToken)
    {
        var command = new CreateCategoryCommand(
            tenantSlug,
            request.ParentId,
            request.Name,
            request.Slug,
            request.Description,
            request.SortOrder,
            request.IsVisible);

        var result = await mediator.Send(command, cancellationToken);

        return StatusCode(StatusCodes.Status201Created, result);
    }

    [HttpPut("{tenantSlug}/{id:guid}")]
    [ProducesResponseType(typeof(CategoryDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<CategoryDto>> Update(
        [FromRoute] string tenantSlug,
        [FromRoute] Guid id,
        [FromBody] UpdateCategoryRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateCategoryCommand(
            tenantSlug,
            id,
            request.ParentId,
            request.Name,
            request.Slug,
            request.Description,
            request.SortOrder,
            request.IsVisible);

        var result = await mediator.Send(command, cancellationToken);

        return Ok(result);
    }

    [HttpDelete("{tenantSlug}/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Remove(
        [FromRoute] string tenantSlug,
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var command = new RemoveCategoryCommand(
            tenantSlug,
            id);

        await mediator.Send(command, cancellationToken);

        return NoContent();
    }

    [HttpPost("{tenantSlug}/reorder")]
    [ProducesResponseType(typeof(ICollection<CategoryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ICollection<CategoryDto>>> Reorder(
        [FromRoute] string tenantSlug,
        [FromBody] ICollection<ReorderCategoryRequest> request,
        CancellationToken cancellationToken)
    {
        var items = request
            .Select(x => new ReorderCategoryItem(
                x.Id,
                x.ParentId,
                x.SortOrder))
            .ToList();

        var command = new ReorderCategoriesCommand(
            tenantSlug,
            items);

        var result = await mediator.Send(command, cancellationToken);

        return Ok(result);
    }

}
