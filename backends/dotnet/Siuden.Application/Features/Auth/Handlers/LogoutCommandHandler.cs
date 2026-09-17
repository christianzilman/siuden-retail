using MediatR;
using Siuden.Application.Features.Auth.Commands;
using Siuden.Application.Interfaces;

namespace Siuden.Application.Features.Auth.Handlers;

public sealed class LogoutCommandHandler(IAuthenticationService authenticationService)
    : IRequestHandler<LogoutCommand>
{
    public async Task Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        await authenticationService.RevokeAsync(request.RefreshToken, cancellationToken);
    }
}
