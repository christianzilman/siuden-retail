using MediatR;
using Siuden.Application.Features.Products.DTOs;

namespace Siuden.Application.Features.Products.Queries;

public sealed record GetAdminProductByIdQuery(
    Guid TenantId,
    long ProductId) : IRequest<AdminProductDetailDto>;
