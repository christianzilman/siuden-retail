using Siuden.Application.Features.Auth.DTOs;

namespace Siuden.Application.Interfaces;

public interface IAuthenticationService
{
    Task<LoginResultDto> SignInStaffAsync(string tenantSlug, string email, string password, CancellationToken cancellationToken);
    Task<LoginResultDto> SignInCustomerAsync(string tenantSlug, string email, string password, CancellationToken cancellationToken);
    Task<LoginResultDto> RefreshAsync(string refreshToken, CancellationToken cancellationToken);
    Task RevokeAsync(string refreshToken, CancellationToken cancellationToken);
}
