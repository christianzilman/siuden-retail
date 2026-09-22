using MediatR;
using Siuden.Application.Features.Tenants.Commands;
using Siuden.Application.Features.Tenants.DTOs;
using Siuden.Application.Interfaces;

namespace Siuden.Application.Features.Tenants.Handlers;

public sealed class UpdateTenantSettingsCommandHandler(ITenantService tenantService)
    : IRequestHandler<UpdateTenantSettingsCommand, PublicTenantDto>
{
    public Task<PublicTenantDto> Handle(UpdateTenantSettingsCommand request, CancellationToken cancellationToken) =>
        tenantService.UpdateSettingsAsync(request, cancellationToken);
}
