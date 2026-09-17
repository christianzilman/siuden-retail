using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity;
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

        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
        services.AddSingleton(jwtOptions);
        services.AddScoped<IJwtService, JwtService>();

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
