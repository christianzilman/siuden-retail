using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Siuden.Api.Contracts.Common;
using Siuden.Api.Contracts.Products;
using Siuden.Api.Mappings;
using Siuden.Application.Features.Products.Commands;
using Siuden.Application.Features.Products.DTOs;
using Siuden.Application.Features.Products.Queries;
using Siuden.Domain.Constants;

namespace Siuden.Api.Controllers;

[ApiController]
[Authorize(Roles = $"{GlobalRoles.Owner},{GlobalRoles.Admin}")]
[Route("api/admin/products")]
public class AdminProductsController(
    IMediator mediator,
    ICurrentTenant currentTenant)
    : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(PagedResponse<AdminProductListItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult> GetAll([FromQuery] GetAdminProductsRequest request)
    {
        var query = new GetAdminProductsQuery(
            currentTenant.TenantId,
            request.Name,
            request.Sku,
            request.CategoryId,
            request.Status,
            request.Stock,
            request.SortBy,
            request.Paging.PageNumber,
            request.Paging.PageSize);

        var result = await mediator.Send(query);

        return Ok(result.ToResponse());
    }


    [HttpPost]
    public async Task<ActionResult<long>> Create(
    [FromBody] CreateProductRequest request)
    {
        var product = new CreateProductData(
            currentTenant.TenantId,
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
            new CreateProductCommand(product));

        return Ok(id);
    }

    [HttpPatch("{productId:long}/status")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ChangeStatus(
       [FromRoute] long productId,
       [FromBody] ChangeProductStatusRequest request)
    {
        var command = new ChangeProductStatusCommand(
            currentTenant.TenantId,
            productId,
            request.Status);

        await mediator.Send(command);

        return NoContent();
    }

    // PUT /api/admin/products/123
    [HttpPut("{productId:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(
    [FromRoute] long productId,
    [FromBody] UpdateProductRequest request)
    {
        var data = new UpdateProductData(
            currentTenant.TenantId,
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
                data));

        return NoContent();
    }

    // POST /api/admin/products/123/duplicate
    [HttpPost("{productId:long}/duplicate")]
    [ProducesResponseType(typeof(long), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<long>> Duplicate(
        [FromRoute] long productId)
    {
        var duplicatedProductId = await mediator.Send(
            new DuplicateProductCommand(
                currentTenant.TenantId,
                productId));

        return StatusCode(
            StatusCodes.Status201Created,
            duplicatedProductId);
    }

    // DELETE /api/admin/products/123
    [HttpDelete("{productId:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(
        [FromRoute] long productId)
    {
        await mediator.Send(
            new DeleteProductCommand(
                currentTenant.TenantId,
                productId));

        return NoContent();
    }
}

public interface ICurrentTenant
{
    Guid TenantId { get; }
}
