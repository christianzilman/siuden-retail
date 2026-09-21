using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Siuden.Api.Contracts.Common;
using Siuden.Api.Contracts.Products;
using Siuden.Api.Mappings;
using Siuden.Api.Security;
using Siuden.Application.Common.Security;
using Siuden.Application.Features.Products.Commands;
using Siuden.Application.Features.Products.DTOs;
using Siuden.Application.Features.Products.Queries;
using Siuden.Domain.Constants;

namespace Siuden.Api.Controllers;

[ApiController]
[Authorize(Roles = $"{GlobalRoles.Owner},{GlobalRoles.Admin}")]
[Route("api/admin/products")]
public class AdminProductsController(
    IMediator mediator)
    : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(PagedResponse<AdminProductListItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResponse<AdminProductListItemDto>>> GetAll(
        [FromQuery] GetAdminProductsRequest request,
        CancellationToken cancellationToken)
    {
        var query = new GetAdminProductsQuery(
            User.GetRequiredGuid(AuthClaimTypes.TenantId),
            request.Name,
            request.Sku,
            request.CategoryId,
            request.Status,
            request.Stock,
            request.SortBy,
            request.Paging.PageNumber,
            request.Paging.PageSize);

        var result = await mediator.Send(query, cancellationToken);

        return Ok(result.ToResponse());
    }

    [HttpGet("{productId:long}")]
    [ProducesResponseType(typeof(AdminProductDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AdminProductDetailDto>> GetById(
        [FromRoute] long productId,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(
            new GetAdminProductByIdQuery(
                User.GetRequiredGuid(AuthClaimTypes.TenantId),
                productId),
            cancellationToken);

        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(long), StatusCodes.Status201Created)]
    public async Task<ActionResult<long>> Create(
        [FromBody] CreateProductRequest request,
        CancellationToken cancellationToken)
    {
        var product = new CreateProductData(
            User.GetRequiredGuid(AuthClaimTypes.TenantId),
            request.Name,
            request.Description,
            request.Status,
            request.SeoTitle,
            request.SeoDescription,
            request.Variants
                .Select(x => new CreateProductVariantItem(
                    x.VariantName,
                    x.Sku,
                    x.BarCode,
                    x.Stock,
                    x.Price,
                    x.Cost,
                    x.WeightKg,
                    x.HeightCm,
                    x.WidthCm,
                    x.DepthCm))
                .ToList(),
            request.Categories
                .Select(x => new CreateProductCategoryItem(
                    x.CategoryId,
                    x.IsPrimary,
                    x.SortOrder))
                .ToList());

        var id = await mediator.Send(
            new CreateProductCommand(product),
            cancellationToken);

        return CreatedAtAction(nameof(GetById), new { productId = id }, id);
    }

    [HttpPatch("{productId:long}/status")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ChangeStatus(
       [FromRoute] long productId,
       [FromBody] ChangeProductStatusRequest request,
       CancellationToken cancellationToken)
    {
        var command = new ChangeProductStatusCommand(
            User.GetRequiredGuid(AuthClaimTypes.TenantId),
            productId,
            request.Status);

        await mediator.Send(command, cancellationToken);

        return NoContent();
    }

    // PUT /api/admin/products/123
    [HttpPut("{productId:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(
    [FromRoute] long productId,
    [FromBody] UpdateProductRequest request,
    CancellationToken cancellationToken)
    {
        var data = new UpdateProductData(
            User.GetRequiredGuid(AuthClaimTypes.TenantId),
            request.Name,
            request.Description,
            request.Status,
            request.SeoTitle,
            request.SeoDescription,
            request.Variants
                .Select(x => new UpdateProductVariantItem(
                    x.Id,
                    x.VariantName,
                    x.Sku,
                    x.BarCode,
                    x.Stock,
                    x.Price,
                    x.Cost,
                    x.WeightKg,
                    x.HeightCm,
                    x.WidthCm,
                    x.DepthCm))
                .ToList(),
            request.Categories
                .Select(x => new UpdateProductCategoryItem(
                    x.CategoryId,
                    x.IsPrimary,
                    x.SortOrder))
                .ToList());

        await mediator.Send(
            new UpdateProductCommand(
                productId,
                data),
            cancellationToken);

        return NoContent();
    }

    // POST /api/admin/products/123/duplicate
    [HttpPost("{productId:long}/duplicate")]
    [ProducesResponseType(typeof(long), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<long>> Duplicate(
        [FromRoute] long productId,
        CancellationToken cancellationToken)
    {
        var duplicatedProductId = await mediator.Send(
            new DuplicateProductCommand(
                User.GetRequiredGuid(AuthClaimTypes.TenantId),
                productId),
            cancellationToken);

        return StatusCode(
            StatusCodes.Status201Created,
            duplicatedProductId);
    }

    // DELETE /api/admin/products/123
    [HttpDelete("{productId:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(
        [FromRoute] long productId,
        CancellationToken cancellationToken)
    {
        await mediator.Send(
            new DeleteProductCommand(
                User.GetRequiredGuid(AuthClaimTypes.TenantId),
                productId),
            cancellationToken);

        return NoContent();
    }
}
