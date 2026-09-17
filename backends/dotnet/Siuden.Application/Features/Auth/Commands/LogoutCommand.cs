using MediatR;

namespace Siuden.Application.Features.Auth.Commands;

public sealed record LogoutCommand(string RefreshToken) : IRequest;
