using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Siuden.Application.Common.Exceptions;
using Siuden.Application.Features.Auth.DTOs;
using Siuden.Application.Interfaces;
using Siuden.Domain.Constants;
using Siuden.Domain.Entities;
using Siuden.Domain.Enums;
using Siuden.Domain.Repositories;
using Siuden.Infrastructure.Authentication;
using Siuden.Infrastructure.Persistence;

namespace Siuden.Infrastructure.Services;

//con constructor clasico
public sealed class AuthenticationService : IAuthenticationService
{
    private readonly SiudenRetailDbContext _context;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IJwtService _jwtService;
    private readonly JwtOptions _jwtOptions;
    private readonly ITenantRepository _tenantRepository;

    public AuthenticationService(
        SiudenRetailDbContext dbContext,
        IPasswordHasher<User> passwordHasher,
        IJwtService jwtService,
        JwtOptions jwtOptions,
        ITenantRepository tenantRepository)
    {
        _context = dbContext;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
        _jwtOptions = jwtOptions;
        _tenantRepository = tenantRepository;
    }

    public async Task<LoginResultDto> SignInStaffAsync(
        string tenantSlug,
        string email,
        string password,
        CancellationToken cancellationToken)
    {
        var tenant = await FindActiveTenantAsync(tenantSlug, cancellationToken);
        var user = await FindAndVerifyUserAsync(
            tenant.Id,
            email,
            password,
            cancellationToken);

        var membership = await _context.AccountMembers
            .Include(member => member.Role)
                .ThenInclude(role => role.RolePermissions)
                .ThenInclude(rolePermission => rolePermission.Permission)
            .SingleOrDefaultAsync(member =>
                member.UserId == user.Id &&
                member.AccountId == tenant.AccountId &&
                member.Status == AccountMemberStatusEnum.ACTIVE &&
                member.Account.Status == AccountStatusEnum.ACTIVE &&
                member.Role.Code != GlobalRoles.Customer,
                cancellationToken)
            ?? throw new UnauthorizedException("Credenciales inválidas");

        var session = new AuthSessionDto
        {
            UserId = user.Id,
            Email = user.Email,
            AccountId = membership.AccountId,
            TenantId = tenant.Id,
            Role = membership.Role.Code,
            Permissions = membership.Role.RolePermissions
                .Select(rolePermission => rolePermission.Permission.Code)
                .Distinct()
                .OrderBy(permission => permission)
                .ToArray()
        };

        return await IssueSessionAsync(session, cancellationToken);
    }

    public async Task<LoginResultDto> SignInCustomerAsync(
        string tenantSlug,
        string email,
        string password,
        CancellationToken cancellationToken)
    {
        var tenant = await FindActiveTenantAsync(tenantSlug, cancellationToken);
        var user = await FindAndVerifyUserAsync(
            tenant.Id,
            email,
            password,
            cancellationToken);
        var customer = await _context.Customers
            .SingleOrDefaultAsync(item =>
                item.TenantId == tenant.Id &&
                item.UserId == user.Id &&
                item.Status == CustomerStatusEnum.ACTIVE,
                cancellationToken)
            ?? throw new UnauthorizedException("Credenciales inválidas");

        var session = new AuthSessionDto
        {
            UserId = user.Id,
            Email = user.Email,
            AccountId = tenant.AccountId,
            TenantId = tenant.Id,
            CustomerId = customer.Id,
            Role = GlobalRoles.Customer,
            Permissions = []
        };

        return await IssueSessionAsync(session, cancellationToken);
    }

    public async Task<LoginResultDto> RefreshAsync(
        string refreshToken,
        CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var tokenHash = HashToken(refreshToken);
        var storedSession = await _context.RefreshSessions
            .SingleOrDefaultAsync(session => session.TokenHash == tokenHash, cancellationToken)
            ?? throw new UnauthorizedException("La sesión no es válida");

        if (storedSession.RevokedAt.HasValue)
        {
            var isConcurrentReuse =
                storedSession.ReplacedBySessionId.HasValue &&
                storedSession.RevokedAt.Value >= now.AddSeconds(
                    -_jwtOptions.RefreshTokenReuseGraceSeconds);

            if (isConcurrentReuse)
            {
                throw new UnauthorizedException("La sesión ya fue actualizada");
            }

            await RevokeFamilyAsync(storedSession.FamilyId, cancellationToken);
            throw new UnauthorizedException("La sesión fue revocada");
        }

        var idleExpiresAtUtc = storedSession.CreatedAt.AddDays(
            _jwtOptions.RefreshTokenIdleExpireDays);

        if (storedSession.ExpiresAt <= now || idleExpiresAtUtc <= now)
        {
            await _context.RefreshSessions
                .Where(item =>
                    item.Id == storedSession.Id &&
                    item.RevokedAt == null)
                .ExecuteUpdateAsync(
                    setters => setters.SetProperty(item => item.RevokedAt, now),
                    cancellationToken);
            throw new UnauthorizedException("La sesión venció");
        }

        var familyStartedAtUtc = await _context.RefreshSessions
            .Where(session => session.FamilyId == storedSession.FamilyId)
            .MinAsync(session => session.CreatedAt, cancellationToken);
        var absoluteExpiresAtUtc = familyStartedAtUtc.AddDays(
            _jwtOptions.RefreshSessionAbsoluteExpireDays);

        if (absoluteExpiresAtUtc <= now)
        {
            await RevokeFamilyAsync(storedSession.FamilyId, cancellationToken);
            throw new UnauthorizedException("La sesión alcanzó su duración máxima");
        }

        var session = await RebuildSessionAsync(storedSession, cancellationToken);
        var replacement = CreateRefreshSession(
            session,
            storedSession.FamilyId,
            absoluteExpiresAtUtc,
            now);

        var accessToken = _jwtService.GenerateToken(session);
        await using var transaction = await _context.Database
            .BeginTransactionAsync(cancellationToken);

        var claimedSessions = await _context.RefreshSessions
            .Where(item =>
                item.Id == storedSession.Id &&
                item.RevokedAt == null)
            .ExecuteUpdateAsync(
                setters => setters
                    .SetProperty(item => item.RevokedAt, now)
                    .SetProperty(
                        item => item.ReplacedBySessionId,
                        replacement.Entity.Id),
                cancellationToken);

        if (claimedSessions == 0)
        {
            await transaction.RollbackAsync(cancellationToken);
            throw new UnauthorizedException("La sesión ya fue actualizada");
        }

        _context.RefreshSessions.Add(replacement.Entity);
        await _context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return ToLoginResult(session, accessToken, replacement);
    }

    public async Task RevokeAsync(
        string refreshToken,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
        {
            return;
        }

        var tokenHash = HashToken(refreshToken);
        var revokedAt = DateTime.UtcNow;
        await _context.RefreshSessions
            .Where(session =>
                session.TokenHash == tokenHash &&
                session.RevokedAt == null)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(session => session.RevokedAt, revokedAt),
                cancellationToken);
    }

    private async Task<User> FindAndVerifyUserAsync(
        Guid tenantId,
        string email,
        string password,
        CancellationToken cancellationToken)
    {
        var normalizedEmail = NormalizeEmail(email);
        var user = await _context.Users.SingleOrDefaultAsync(
            item =>
                item.TenantId == tenantId &&
                item.Email == normalizedEmail &&
                item.Status == UserStatusEnum.ACTIVE,
            cancellationToken);

        if (user is null)
        {
            throw new UnauthorizedException("Credenciales inválidas");
        }

        var verification = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            password);

        if (verification == PasswordVerificationResult.Failed)
        {
            throw new UnauthorizedException("Credenciales inválidas");
        }

        if (verification == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = _passwordHasher.HashPassword(user, password);
        }

        return user;
    }

    private async Task<LoginResultDto> IssueSessionAsync(
        AuthSessionDto session,
        CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var accessToken = _jwtService.GenerateToken(session);
        var refresh = CreateRefreshSession(
            session,
            Guid.NewGuid(),
            now.AddDays(_jwtOptions.RefreshSessionAbsoluteExpireDays),
            now);
        _context.RefreshSessions.Add(refresh.Entity);
        await _context.SaveChangesAsync(cancellationToken);
        return ToLoginResult(session, accessToken, refresh);
    }

    private async Task<AuthSessionDto> RebuildSessionAsync(
        RefreshSession storedSession,
        CancellationToken cancellationToken)
    {
        var user = await _context.Users.SingleOrDefaultAsync(item =>
            item.Id == storedSession.UserId &&
            item.TenantId == storedSession.TenantId &&
            item.Status == UserStatusEnum.ACTIVE,
            cancellationToken)
            ?? throw new UnauthorizedException("La identidad ya no está activa");

        var tenantIsActive = await _context.Tenants.AnyAsync(tenant =>
            tenant.Id == storedSession.TenantId &&
            tenant.AccountId == storedSession.AccountId &&
            tenant.Status == TenantStatusEnum.ACTIVE &&
            tenant.Account.Status == AccountStatusEnum.ACTIVE,
            cancellationToken);

        if (!tenantIsActive)
        {
            throw new UnauthorizedException("La tienda ya no está activa");
        }

        if (storedSession.RoleCode == GlobalRoles.Customer)
        {
            var customerIsActive = storedSession.CustomerId.HasValue &&
                await _context.Customers.AnyAsync(customer =>
                    customer.Id == storedSession.CustomerId.Value &&
                    customer.UserId == user.Id &&
                    customer.TenantId == storedSession.TenantId &&
                    customer.Status == CustomerStatusEnum.ACTIVE,
                    cancellationToken);
            
            if (!customerIsActive)
            {
                throw new UnauthorizedException("El cliente ya no está activo");
            }

            return new AuthSessionDto
            {
                UserId = user.Id,
                Email = user.Email,
                AccountId = storedSession.AccountId,
                TenantId = storedSession.TenantId,
                CustomerId = storedSession.CustomerId,
                Role = GlobalRoles.Customer,
                Permissions = []
            };
        }

        var membership = await _context.AccountMembers
            .Include(member => member.Role)
                .ThenInclude(role => role.RolePermissions)
                .ThenInclude(rolePermission => rolePermission.Permission)
            .SingleOrDefaultAsync(member =>
                member.UserId == user.Id &&
                member.AccountId == storedSession.AccountId &&
                member.Status == AccountMemberStatusEnum.ACTIVE &&
                member.Role.Code == storedSession.RoleCode,
                cancellationToken)
            ?? throw new UnauthorizedException("La membresía ya no está activa");

        return new AuthSessionDto
        {
            UserId = user.Id,
            Email = user.Email,
            AccountId = storedSession.AccountId,
            TenantId = storedSession.TenantId,
            Role = membership.Role.Code,
            Permissions = membership.Role.RolePermissions
                .Select(rolePermission => rolePermission.Permission.Code)
                .Distinct()
                .OrderBy(permission => permission)
                .ToArray()
        };
    }

    private RefreshTokenPair CreateRefreshSession(
        AuthSessionDto session,
        Guid familyId,
        DateTime absoluteExpiresAtUtc,
        DateTime now)
    {
        var rawToken = Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
        var idleExpiresAtUtc = now.AddDays(_jwtOptions.RefreshTokenIdleExpireDays);
        var expiresAtUtc = idleExpiresAtUtc < absoluteExpiresAtUtc
            ? idleExpiresAtUtc
            : absoluteExpiresAtUtc;
        var entity = new RefreshSession
        {
            Id = Guid.NewGuid(),
            UserId = session.UserId,
            AccountId = session.AccountId,
            TenantId = session.TenantId,
            CustomerId = session.CustomerId,
            FamilyId = familyId,
            RoleCode = session.Role,
            TokenHash = HashToken(rawToken),
            ExpiresAt = expiresAtUtc,
            CreatedAt = now
        };

        return new RefreshTokenPair(rawToken, expiresAtUtc, entity);
    }

    private async Task RevokeFamilyAsync(Guid familyId, CancellationToken cancellationToken)
    {
        var revokedAt = DateTime.UtcNow;
        await _context.RefreshSessions
            .Where(session =>
                session.FamilyId == familyId &&
                session.RevokedAt == null)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(session => session.RevokedAt, revokedAt),
                cancellationToken);
    }

    private static LoginResultDto ToLoginResult(
        AuthSessionDto session,
        GeneratedAccessTokenDto accessToken,
        RefreshTokenPair refresh)
    {
        return new LoginResultDto
        {
            AccessToken = accessToken.Token,
            AccessTokenExpiresAtUtc = accessToken.ExpiresAtUtc,
            Session = session,
            RefreshToken = refresh.RawToken,
            RefreshTokenExpiresAtUtc = refresh.ExpiresAtUtc
        };
    }

    private static string NormalizeEmail(string email) =>
        email.Trim().ToLowerInvariant();

    private async Task<Tenant> FindActiveTenantAsync(
        string tenantSlug,
        CancellationToken cancellationToken)
    {
        var normalizedSlug = tenantSlug.Trim().ToLowerInvariant();
        return await _tenantRepository.GetActiveBySlugAsync(
            normalizedSlug,
            cancellationToken)
            ?? throw new UnauthorizedException("Credenciales inválidas");
    }

    private static string HashToken(string token) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));

    private sealed record RefreshTokenPair(
        string RawToken,
        DateTime ExpiresAtUtc,
        RefreshSession Entity);
}
