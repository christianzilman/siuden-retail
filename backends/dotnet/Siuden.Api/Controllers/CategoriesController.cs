using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Siuden.Api.Contracts.Categories;
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

}
