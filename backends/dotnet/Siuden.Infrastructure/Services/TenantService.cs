using Mapster;
using Microsoft.EntityFrameworkCore;
using Siuden.Application.Common.Exceptions;
using Siuden.Application.Features.Tenants.DTOs;
using Siuden.Application.Features.Tenants.Commands;
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

    public async Task<PublicTenantDto> GetByIdAsync(Guid tenantId, CancellationToken cancellationToken)
    {
        var tenant = await tenantRepository.GetByIdAsync(tenantId, cancellationToken)
            ?? throw new NotFoundException("La tienda no existe");

        return tenant.Adapt<PublicTenantDto>();
    }

    public async Task<PublicTenantDto> UpdateSettingsAsync(
        UpdateTenantSettingsCommand command,
        CancellationToken cancellationToken)
    {
        var tenant = await tenantRepository.GetByIdAsync(command.TenantId, cancellationToken)
            ?? throw new NotFoundException("La tienda no existe");

        tenant.BrandName = command.BrandName.Trim();
        tenant.ContactEmail = command.ContactEmail.Trim().ToLowerInvariant();
        tenant.Phone = command.Phone.Trim();
        tenant.AddressLine = command.AddressLine.Trim();
        tenant.AddressNumber = command.AddressNumber.Trim();
        tenant.City = command.City.Trim();
        tenant.Province = command.Province.Trim();
        tenant.PostalCode = command.PostalCode.Trim();
        tenant.CountryCode = command.CountryCode.Trim().ToUpperInvariant();
        tenant.PrimaryColor = command.PrimaryColor.ToUpperInvariant();
        tenant.SecondaryColor = command.SecondaryColor.ToUpperInvariant();
        tenant.BackgroundColor = command.BackgroundColor.ToUpperInvariant();
        tenant.TextColor = command.TextColor.ToUpperInvariant();
        tenant.HeadingFont = command.HeadingFont.Trim();
        tenant.BodyFont = command.BodyFont.Trim();
        tenant.BorderRadius = command.BorderRadius.Trim();
        tenant.AnnouncementEnabled = command.AnnouncementEnabled;
        tenant.AnnouncementText = command.AnnouncementText.Trim();
        tenant.AnnouncementUrl = NullIfWhiteSpace(command.AnnouncementUrl);
        tenant.FaviconUrl = NullIfWhiteSpace(command.FaviconUrl);
        tenant.LogoUrl = NullIfWhiteSpace(command.LogoUrl);
        tenant.UpdatedAt = DateTime.UtcNow;

        await tenantRepository.UpdateAsync(tenant, cancellationToken);
        return tenant.Adapt<PublicTenantDto>();
    }

    private static string? NullIfWhiteSpace(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
