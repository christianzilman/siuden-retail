using Siuden.Application.Features.AccountMembers.Commands;
using Siuden.Application.Features.Auth.Commands;
using Siuden.Application.Features.Customers.Commands;
using Siuden.Application.Validators.AccountMembers;
using Siuden.Application.Validators.Auth;
using Siuden.Application.Validators.Customers;
using Siuden.Domain.Rules;
using Xunit;

namespace Siuden.Application.Tests;

public sealed class MvpArchitectureRulesTests
{
    [Theory]
    [InlineData("OWNER", "ADMIN", true)]
    [InlineData("OWNER", "SELLER", true)]
    [InlineData("OWNER", "STOCK_MANAGER", true)]
    [InlineData("OWNER", "OWNER", false)]
    [InlineData("ADMIN", "SELLER", true)]
    [InlineData("ADMIN", "STOCK_MANAGER", true)]
    [InlineData("ADMIN", "ADMIN", false)]
    [InlineData("SELLER", "STOCK_MANAGER", false)]
    [InlineData("CUSTOMER", "SELLER", false)]
    public void RoleAssignmentMatchesMvpPolicy(
        string requesterRole,
        string requestedRole,
        bool expected)
    {
        Assert.Equal(
            expected,
            AccountMemberRolePolicy.CanAssign(requesterRole, requestedRole));
    }

    [Theory]
    [InlineData("admin")]
    [InlineData("api")]
    [InlineData("assets")]
    [InlineData("login")]
    [InlineData("ADMIN")]
    public void PlatformSlugsAreReserved(string slug)
    {
        Assert.True(TenantSlugPolicy.IsReserved(slug));
    }

    [Fact]
    public async Task CustomerRegistrationRejectsDifferentPasswordConfirmation()
    {
        var validator = new RegisterCustomerCommandValidator();
        var result = await validator.ValidateAsync(new RegisterCustomerCommand
        {
            TenantSlug = "rubi",
            FirstName = "Cliente",
            LastName = "Prueba",
            Email = "cliente@example.com",
            Password = "Rubi2026!",
            PasswordConfirmation = "Otra2026!"
        });

        Assert.False(result.IsValid);
        Assert.Contains(
            result.Errors,
            error => error.PropertyName == nameof(RegisterCustomerCommand.PasswordConfirmation));
    }

    [Fact]
    public async Task AccountMemberCommandRejectsCustomerRole()
    {
        var validator = new CreateAccountMemberCommandValidator();
        var result = await validator.ValidateAsync(new CreateAccountMemberCommand
        {
            RequesterUserId = Guid.NewGuid(),
            AccountId = Guid.NewGuid(),
            TenantId = Guid.NewGuid(),
            Email = "empleado@example.com",
            RoleCode = "CUSTOMER",
            TemporaryPassword = "Temporal2026!"
        });

        Assert.False(result.IsValid);
        Assert.Contains(
            result.Errors,
            error => error.PropertyName == nameof(CreateAccountMemberCommand.RoleCode));
    }

    [Fact]
    public async Task StaffLoginRequiresTenantSlug()
    {
        var validator = new LoginCommandValidator();
        var result = await validator.ValidateAsync(new LoginCommand
        {
            Email = "admin@example.com",
            Password = "Temporal2026!"
        });

        Assert.False(result.IsValid);
        Assert.Contains(
            result.Errors,
            error => error.PropertyName == nameof(LoginCommand.TenantSlug));
    }
}
