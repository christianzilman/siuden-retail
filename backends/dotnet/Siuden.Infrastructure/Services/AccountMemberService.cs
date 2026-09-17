using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Siuden.Application.Common.Exceptions;
using Siuden.Application.Features.AccountMembers.Commands;
using Siuden.Application.Features.AccountMembers.DTOs;
using Siuden.Application.Interfaces;
using Siuden.Domain.Entities;
using Siuden.Domain.Enums;
using Siuden.Domain.Repositories;
using Siuden.Domain.Rules;
using Siuden.Infrastructure.Persistence;

namespace Siuden.Infrastructure.Services;

//con constructor primario
public sealed class AccountMemberService(
    SiudenRetailDbContext dbContext,
    ITenantRepository tenantRepository,
    IUserRepository userRepository,
    IAccountMemberRepository accountMemberRepository,
    IRoleRepository roleRepository,
    IPasswordHasher<User> passwordHasher) : IAccountMemberService
{
    public async Task<AccountMemberDto> CreateAsync(
        CreateAccountMemberCommand command,
        CancellationToken cancellationToken)
    {
        var requester = await accountMemberRepository.GetActiveByUserAndAccountAsync(command.RequesterUserId, command.AccountId, cancellationToken);
        
        if(requester == null)
            throw new ForbiddenException("No tenés permisos para administrar miembros");

        var requestedRoleCode = command.RoleCode.Trim().ToUpperInvariant();
        if (!AccountMemberRolePolicy.CanAssign(
                requester.Role.Code,
                requestedRoleCode))
        {
            throw new ForbiddenException("No podés asignar el rol solicitado");
        }

        var tenantBelongsToAccount = await tenantRepository.IsActiveAndBelongsToAccountAsync(
            command.TenantId,
            command.AccountId,
            cancellationToken);

        if (!tenantBelongsToAccount)
        {
            throw new ForbiddenException("El tenant de la sesión no pertenece a la cuenta");
        }

        var email = command.Email.Trim().ToLowerInvariant();
        if (await userRepository.ExistByTenantIdAndEmail(
                command.TenantId,
                email,
                cancellationToken))
        {
            throw new ConflictException("Ya existe un usuario con ese email en esta tienda");
        }

        var role = await roleRepository.GetByCodeAsync(
            requestedRoleCode,
            cancellationToken)
            ?? throw new NotFoundException("El rol solicitado no existe");

        var user = new User
        {
            Id = Guid.NewGuid(),
            TenantId = command.TenantId,
            Email = email,
            Status = UserStatusEnum.ACTIVE,
            EmailVerifiedAt = null
        };
        user.PasswordHash = passwordHasher.HashPassword(user, command.TemporaryPassword);

        var member = new AccountMember
        {
            Id = Guid.NewGuid(),
            AccountId = command.AccountId,
            UserId = user.Id,
            RoleId = role.Id,
            Status = AccountMemberStatusEnum.ACTIVE
        };

        userRepository.AddEntity(user);
        accountMemberRepository.AddEntity(member);

        try
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (
            exception.InnerException is PostgresException
            {
                SqlState: PostgresErrorCodes.UniqueViolation
            })
        {
            throw new ConflictException("No fue posible crear el miembro de la cuenta");
        }

        return new AccountMemberDto
        {
            Id = member.Id,
            UserId = user.Id,
            Email = user.Email,
            AccountId = member.AccountId,
            Role = role.Code,
            Status = member.Status.ToString()
        };
    }

    public async Task<IReadOnlyCollection<AccountMemberDto>> GetAllAsync(
        Guid requesterUserId,
        Guid accountId,
        CancellationToken cancellationToken)
    {
        await GetAuthorizedRequesterAsync(
            requesterUserId,
            accountId,
            cancellationToken);

        var members = await accountMemberRepository.GetStaffByAccountAsync(
            accountId,
            cancellationToken);

        return members
            .Select(member => new AccountMemberDto
            {
                Id = member.Id,
                UserId = member.UserId,
                Email = member.User.Email,
                AccountId = member.AccountId,
                Role = member.Role.Code,
                Status = member.Status.ToString()
            })
            .ToArray();
    }

    public async Task<AccountMemberDto> UpdateAsync(
        UpdateAccountMemberCommand command,
        CancellationToken cancellationToken)
    {
        var requester = await GetAuthorizedRequesterAsync(
            command.RequesterUserId,
            command.AccountId,
            cancellationToken);

        var target = await accountMemberRepository.GetByIdAndAccountAsync(
            command.MemberId,
            command.AccountId,
            cancellationToken)
            ?? throw new NotFoundException("El miembro no existe");

        if (target.UserId == requester.UserId)
        {
            throw new ForbiddenException("No podés modificar tu propia membresía");
        }

        if (!AccountMemberRolePolicy.CanManage(
                requester.Role.Code,
                target.Role.Code))
        {
            throw new ForbiddenException("No podés modificar ese miembro");
        }

        if (!string.IsNullOrWhiteSpace(command.RoleCode))
        {
            var requestedRoleCode = command.RoleCode.Trim().ToUpperInvariant();
            if (!AccountMemberRolePolicy.CanAssign(
                    requester.Role.Code,
                    requestedRoleCode))
            {
                throw new ForbiddenException("No podés asignar el rol solicitado");
            }

            var role = await roleRepository.GetByCodeAsync(
                requestedRoleCode,
                cancellationToken)
                ?? throw new NotFoundException("El rol solicitado no existe");

            target.RoleId = role.Id;
            target.Role = role;
        }

        if (!string.IsNullOrWhiteSpace(command.Status))
        {
            target.Status = Enum.Parse<AccountMemberStatusEnum>(
                command.Status.Trim(),
                ignoreCase: true);
        }

        target.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);

        return new AccountMemberDto
        {
            Id = target.Id,
            UserId = target.UserId,
            Email = target.User.Email,
            AccountId = target.AccountId,
            Role = target.Role.Code,
            Status = target.Status.ToString()
        };
    }

    private async Task<AccountMember> GetAuthorizedRequesterAsync(
        Guid requesterUserId,
        Guid accountId,
        CancellationToken cancellationToken)
    {
        var requester = await accountMemberRepository.GetActiveByUserAndAccountAsync(requesterUserId, accountId, cancellationToken);

        if(requester == null)
            throw new ForbiddenException("No tenés permisos para administrar miembros");

        if (!AccountMemberRolePolicy.CanManageMembers(requester.Role.Code))
        {
            throw new ForbiddenException("No tenés permisos para administrar miembros");
        }

        return requester;
    }
}
