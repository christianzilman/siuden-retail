using MediatR;
using Siuden.Application.Features.Tenants.DTOs;

namespace Siuden.Application.Features.Tenants.Queries;

public sealed record GetPublicTenantQuery(string TenantSlug) : IRequest<PublicTenantDto>;
