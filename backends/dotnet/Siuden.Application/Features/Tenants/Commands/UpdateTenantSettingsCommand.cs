using MediatR;
using Siuden.Application.Features.Tenants.DTOs;

namespace Siuden.Application.Features.Tenants.Commands;

public sealed record UpdateTenantSettingsCommand(
    Guid TenantId,
    string BrandName,
    string ContactEmail,
    string Phone,
    string AddressLine,
    string AddressNumber,
    string City,
    string Province,
    string PostalCode,
    string CountryCode,
    string PrimaryColor,
    string SecondaryColor,
    string BackgroundColor,
    string TextColor,
    string HeadingFont,
    string BodyFont,
    string BorderRadius,
    bool AnnouncementEnabled,
    string AnnouncementText,
    string? AnnouncementUrl,
    string? FaviconUrl,
    string? LogoUrl) : IRequest<PublicTenantDto>;
