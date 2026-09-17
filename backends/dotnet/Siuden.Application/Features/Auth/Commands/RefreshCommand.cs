using MediatR;
using Siuden.Application.Features.Auth.DTOs;

namespace Siuden.Application.Features.Auth.Commands;

public sealed record RefreshCommand(string RefreshToken) : IRequest<LoginResultDto>;
