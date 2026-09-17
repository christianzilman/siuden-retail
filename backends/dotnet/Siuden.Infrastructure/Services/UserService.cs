using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Siuden.Application.Features.Auth.DTOs;
using Siuden.Application.Interfaces;
using Siuden.Infrastructure.Persistence;

namespace Siuden.Infrastructure.Services;

public sealed class UserService : IUserService
{
    private readonly SiudenRetailDbContext _context;
    private readonly IJwtService _jwtService;
    private readonly IPasswordHasher<Domain.Entities.User> _passwordHasher;

    public UserService(
        SiudenRetailDbContext context,
        IJwtService jwtService,
        IPasswordHasher<Domain.Entities.User> passwordHasher)
    {
        _context = context;
        _jwtService = jwtService;
        _passwordHasher = passwordHasher;
    }

    public async Task<LoginResultDto?> SignIn(
        string email,
        string password,
        CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(
                u => u.Email == email && u.Status == Domain.Enums.UserStatusEnum.ACTIVE,
                cancellationToken);

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
            await _context.SaveChangesAsync(cancellationToken);
        }

        var token = _jwtService.GenerateToken(user);

        return new LoginResultDto
        {
            Token = token,
            Email = user.Email
        };
    }
}
