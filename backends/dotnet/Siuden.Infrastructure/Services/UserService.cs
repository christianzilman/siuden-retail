using Microsoft.AspNetCore.Identity;
using Siuden.Application.Features.Auth.DTOs;
using Siuden.Application.Interfaces;
using Siuden.Domain.Repositories;

namespace Siuden.Infrastructure.Services;

public sealed class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;
    private readonly IPasswordHasher<Domain.Entities.User> _passwordHasher;

    public UserService(
        IUserRepository userRepository,
        IJwtService jwtService,
        IPasswordHasher<Domain.Entities.User> passwordHasher)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _passwordHasher = passwordHasher;
    }

    public async Task<LoginResultDto?> SignIn(
        string email,
        string password,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetActiveByEmailAsync(email, cancellationToken);

        if (user is null)
            return null;

        var verificationResult = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            password);

        if (verificationResult == PasswordVerificationResult.Failed)
            return null;

        if (verificationResult == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = _passwordHasher.HashPassword(user, password);
            await _userRepository.UpdateAsync(user, cancellationToken);
        }

        var token = _jwtService.GenerateToken(user);

        return new LoginResultDto
        {
            Token = token,
            Email = user.Email
        };
    }
}
