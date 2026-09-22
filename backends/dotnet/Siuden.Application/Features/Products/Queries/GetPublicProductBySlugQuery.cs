using MediatR;
using Siuden.Application.Features.Products.DTOs;

namespace Siuden.Application.Features.Products.Queries;

public sealed record GetPublicProductBySlugQuery(
    string TenantSlug,
    string ProductSlug) : IRequest<PublicProductDetailDto>;
