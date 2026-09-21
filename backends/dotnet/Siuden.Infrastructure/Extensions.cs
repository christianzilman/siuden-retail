using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Siuden.Application.Features.Products.Repositories;
using Siuden.Application.Interfaces;
using Siuden.Domain.Entities;
using Siuden.Domain.Repositories;
using Siuden.Infrastructure.Authentication;
using Siuden.Infrastructure.Persistence;
using Siuden.Infrastructure.Persistence.Repositories;
using Siuden.Infrastructure.Services;
namespace Siuden.Infrastructure;

public static class Extensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        string connectionString,
        JwtOptions jwtOptions)
    {
        services.AddDbContext<SiudenRetailDbContext>(options =>
            options.UseNpgsql(connectionString));

        //repository

        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IProductReadRepository, ProductReadRepository>();


        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ITenantRepository, TenantRepository>();
        services.AddScoped<IAccountMemberRepository, AccountMemberRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();

        services.AddSingleton(jwtOptions);

        //services
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IAuthenticationService, AuthenticationService>();
        services.AddScoped<ICustomerRegistrationService, CustomerRegistrationService>();
        services.AddScoped<IAccountMemberService, AccountMemberService>();
        services.AddScoped<ITenantService, TenantService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IProductService, ProductService>();


        return services;
    }


    //public static WebApplication AddInfrastructure(this WebApplicationBuilder builder)
    //{
    //    var postgresOptions = builder.GetOptions<PostgresOptions>("postgres");

    //    builder.Services.AddDbContext<SiudenRetailDbContext>(options =>
    //        options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

    //    return builder;
    //}
}
