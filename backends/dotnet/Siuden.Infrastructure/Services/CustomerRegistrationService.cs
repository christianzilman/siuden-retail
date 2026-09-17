using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Siuden.Application.Common.Exceptions;
using Siuden.Application.Features.Customers.Commands;
using Siuden.Application.Features.Customers.DTOs;
using Siuden.Application.Interfaces;
using Siuden.Domain.Entities;
using Siuden.Domain.Enums;
using Siuden.Domain.Repositories;
using Siuden.Infrastructure.Persistence;

namespace Siuden.Infrastructure.Services;

public sealed class CustomerRegistrationService(
    SiudenRetailDbContext dbContext,
    ITenantRepository tenantRepository,
    IUserRepository userRepository,
    ICustomerRepository customerRepository,
    IPasswordHasher<User> passwordHasher) : ICustomerRegistrationService
{
    public async Task<CustomerDto> RegisterAsync(
        RegisterCustomerCommand command,
        CancellationToken cancellationToken)
    {
        var tenantSlug = command.TenantSlug.Trim().ToLowerInvariant();
        var email = command.Email.Trim().ToLowerInvariant();

        var tenant = await tenantRepository.GetActiveBySlugAsync(tenantSlug, cancellationToken);

        if(tenant == null) 
            throw new NotFoundException("La tienda no está disponible");

        var existUser = await userRepository.ExistByTenantIdAndEmail(
            tenant.Id,
            email,
            cancellationToken);

        if (existUser)
        {
            throw new ConflictException(
                "Ya existe un usuario con ese email en esta tienda. Iniciá sesión para continuar.");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            TenantId = tenant.Id,
            Email = email,
            Status = UserStatusEnum.ACTIVE,
            EmailVerifiedAt = null
        };
        user.PasswordHash = passwordHasher.HashPassword(user, command.Password);

        var customer = new Customer
        {
            Id = Guid.NewGuid(),
            TenantId = tenant.Id,
            UserId = user.Id,
            Name = command.FirstName.Trim(),
            SurName = command.LastName.Trim(),
            Email = email,
            Phone = string.IsNullOrWhiteSpace(command.Phone) ? null : command.Phone.Trim(),
            CustomerType = CustomerTypeEnum.Retail,
            Status = CustomerStatusEnum.ACTIVE
        };

        userRepository.AddEntity(user);
        customerRepository.AddEntity(customer);

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
            throw new ConflictException("No fue posible registrar el cliente con esos datos");
        }

        return new CustomerDto
        {
            Id = customer.Id,
            UserId = user.Id,
            TenantId = tenant.Id,
            FirstName = customer.Name,
            LastName = customer.SurName,
            Email = customer.Email,
            Phone = customer.Phone
        };
    }
}
