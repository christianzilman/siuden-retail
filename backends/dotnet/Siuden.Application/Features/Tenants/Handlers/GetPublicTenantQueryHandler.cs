using MediatR;
using Siuden.Application.Features.Tenants.DTOs;
using Siuden.Application.Features.Tenants.Queries;
using Siuden.Application.Interfaces;

namespace Siuden.Application.Features.Tenants.Handlers;

public sealed class GetPublicTenantQueryHandler(ITenantService tenantQueryService)
    : IRequestHandler<GetPublicTenantQuery, PublicTenantDto>
{
    public Task<PublicTenantDto> Handle(GetPublicTenantQuery request, CancellationToken cancellationToken)
    {
        return tenantQueryService.GetPublicAsync(request.TenantSlug, cancellationToken);
    }
}
