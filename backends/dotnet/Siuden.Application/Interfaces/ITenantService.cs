using Siuden.Application.Features.Tenants.DTOs;
using Siuden.Application.Features.Tenants.Commands;

namespace Siuden.Application.Interfaces;

public interface ITenantService
{
    Task<PublicTenantDto> GetPublicAsync(string tenantSlug, CancellationToken cancellationToken);
    Task<PublicTenantDto> GetByIdAsync(Guid tenantId, CancellationToken cancellationToken);
    Task<PublicTenantDto> UpdateSettingsAsync(UpdateTenantSettingsCommand command, CancellationToken cancellationToken);
}
