namespace Siuden.Api.Contracts.Tenants;

public sealed class UpdateTenantSettingsRequest
{
    public string BrandName { get; init; } = string.Empty;
    public string ContactEmail { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public string AddressLine { get; init; } = string.Empty;
    public string AddressNumber { get; init; } = string.Empty;
    public string City { get; init; } = string.Empty;
    public string Province { get; init; } = string.Empty;
    public string PostalCode { get; init; } = string.Empty;
    public string CountryCode { get; init; } = string.Empty;
    public string PrimaryColor { get; init; } = string.Empty;
    public string SecondaryColor { get; init; } = string.Empty;
    public string BackgroundColor { get; init; } = string.Empty;
    public string TextColor { get; init; } = string.Empty;
    public string HeadingFont { get; init; } = string.Empty;
    public string BodyFont { get; init; } = string.Empty;
    public string BorderRadius { get; init; } = string.Empty;
    public bool AnnouncementEnabled { get; init; }
    public string AnnouncementText { get; init; } = string.Empty;
    public string? AnnouncementUrl { get; init; }
    public string? FaviconUrl { get; init; }
    public string? LogoUrl { get; init; }
}
