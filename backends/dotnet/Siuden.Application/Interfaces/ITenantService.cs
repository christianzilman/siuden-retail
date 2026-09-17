using Siuden.Application.Features.Tenants.DTOs;

namespace Siuden.Application.Interfaces;

public interface ITenantService
{
    Task<PublicTenantDto> GetPublicAsync(string tenantSlug, CancellationToken cancellationToken);
}
