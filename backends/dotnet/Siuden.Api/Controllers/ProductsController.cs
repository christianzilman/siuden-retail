using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Siuden.Api.Contracts.Common;
using Siuden.Api.Contracts.Products;
using Siuden.Api.Mappings;
using Siuden.Application.Features.Categories.DTOs;
using Siuden.Application.Features.Categories.Queries;
using Siuden.Application.Features.Products.DTOs;
using Siuden.Application.Features.Products.Queries;

namespace Siuden.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController(IMediator mediator) : ControllerBase
{
    [HttpGet("{tenantSlug}")]
    [ProducesResponseType(typeof(PagedResponse<ProductListItemDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PagedResponse<ProductListItemDto>>> GetAll(
        [FromRoute] string tenantSlug,
        [FromQuery] GetProductsRequest request,
        CancellationToken cancellationToken)
    {
        var query = new GetProductsQuery(
            tenantSlug,
            request.CategoryId,
            request.SortBy,
            request.Paging.PageNumber,
            request.Paging.PageSize);

        var result = await mediator.Send(query, cancellationToken);

        return Ok(result.ToResponse());
    }
}
