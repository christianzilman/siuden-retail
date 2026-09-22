using MediatR;
using Siuden.Application.Features.Tenants.DTOs;
using Siuden.Application.Features.Tenants.Queries;
using Siuden.Application.Interfaces;

namespace Siuden.Application.Features.Tenants.Handlers;

public sealed class GetAdminTenantQueryHandler(ITenantService tenantService)
    : IRequestHandler<GetAdminTenantQuery, PublicTenantDto>
{
    public Task<PublicTenantDto> Handle(GetAdminTenantQuery request, CancellationToken cancellationToken) =>
        tenantService.GetByIdAsync(request.TenantId, cancellationToken);
}
