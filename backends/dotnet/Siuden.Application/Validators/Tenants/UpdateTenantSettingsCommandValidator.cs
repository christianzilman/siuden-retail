using FluentValidation;
using Siuden.Application.Features.Tenants.Commands;

namespace Siuden.Application.Validators.Tenants;

public sealed class UpdateTenantSettingsCommandValidator : AbstractValidator<UpdateTenantSettingsCommand>
{
    private const string CssColorPattern = "^#[0-9a-fA-F]{6}$";
    private const string CssLengthPattern = "^[0-9]+(?:\\.[0-9]+)?(?:px|rem|em)$";

    public UpdateTenantSettingsCommandValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.BrandName).NotEmpty().MaximumLength(200);
        RuleFor(x => x.ContactEmail).NotEmpty().EmailAddress().MaximumLength(255);
        RuleFor(x => x.Phone).NotEmpty().Matches("^[0-9+() -]{6,30}$");
        RuleFor(x => x.AddressLine).NotEmpty().MaximumLength(200);
        RuleFor(x => x.AddressNumber).NotEmpty().MaximumLength(30);
        RuleFor(x => x.City).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Province).NotEmpty().MaximumLength(150);
        RuleFor(x => x.PostalCode).NotEmpty().MaximumLength(20);
        RuleFor(x => x.CountryCode).NotEmpty().Length(2).Matches("^[A-Za-z]{2}$");
        RuleFor(x => x.PrimaryColor).Matches(CssColorPattern);
        RuleFor(x => x.SecondaryColor).Matches(CssColorPattern);
        RuleFor(x => x.BackgroundColor).Matches(CssColorPattern);
        RuleFor(x => x.TextColor).Matches(CssColorPattern);
        RuleFor(x => x.HeadingFont).NotEmpty().MaximumLength(200);
        RuleFor(x => x.BodyFont).NotEmpty().MaximumLength(200);
        RuleFor(x => x.BorderRadius).Matches(CssLengthPattern).MaximumLength(20);
        RuleFor(x => x.AnnouncementText).MaximumLength(300)
            .NotEmpty().When(x => x.AnnouncementEnabled);
        RuleFor(x => x.AnnouncementUrl).MaximumLength(2048)
            .Must(BeAbsoluteHttpUrl).When(x => !string.IsNullOrWhiteSpace(x.AnnouncementUrl));
        RuleFor(x => x.FaviconUrl).MaximumLength(2048)
            .Must(BeWebPathOrAbsoluteHttpUrl).When(x => !string.IsNullOrWhiteSpace(x.FaviconUrl));
        RuleFor(x => x.LogoUrl).MaximumLength(2048)
            .Must(BeWebPathOrAbsoluteHttpUrl).When(x => !string.IsNullOrWhiteSpace(x.LogoUrl));
    }

    private static bool BeAbsoluteHttpUrl(string? value) =>
        Uri.TryCreate(value, UriKind.Absolute, out var uri) &&
        (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);

    private static bool BeWebPathOrAbsoluteHttpUrl(string? value) =>
        value!.StartsWith('/') || BeAbsoluteHttpUrl(value);
}
