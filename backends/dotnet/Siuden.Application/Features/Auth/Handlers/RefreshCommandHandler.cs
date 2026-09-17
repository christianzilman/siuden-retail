using MediatR;
using Siuden.Application.Features.Auth.Commands;
using Siuden.Application.Features.Auth.DTOs;
using Siuden.Application.Interfaces;

namespace Siuden.Application.Features.Auth.Handlers;

public sealed class RefreshCommandHandler(IAuthenticationService authenticationService)
    : IRequestHandler<RefreshCommand, LoginResultDto>
{
    public Task<LoginResultDto> Handle(RefreshCommand request, CancellationToken cancellationToken)
    {
        return authenticationService.RefreshAsync(request.RefreshToken, cancellationToken);
    }
}
