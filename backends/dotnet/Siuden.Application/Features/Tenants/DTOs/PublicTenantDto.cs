namespace Siuden.Application.Features.Tenants.DTOs;

public sealed class PublicTenantDto
{
    public Guid Id { get; init; }
    public string Slug { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
}
