using Mapster;
using Microsoft.EntityFrameworkCore;
using Siuden.Application.Common.Exceptions;
using Siuden.Application.Features.Tenants.DTOs;
using Siuden.Application.Interfaces;
using Siuden.Domain.Enums;
using Siuden.Domain.Repositories;
using Siuden.Infrastructure.Persistence;

namespace Siuden.Infrastructure.Services;

public sealed class TenantService(ITenantRepository tenantRepository) : ITenantService
{
    public async Task<PublicTenantDto> GetPublicAsync(
        string tenantSlug,
        CancellationToken cancellationToken)
    {
        var normalizedSlug = tenantSlug.Trim().ToLowerInvariant();

        var tenant = await tenantRepository.GetActiveBySlugAsync(normalizedSlug, cancellationToken);

        if (tenant == null)
            throw new NotFoundException("La tienda no está disponible");

        return tenant.Adapt<PublicTenantDto>();
    }
}
