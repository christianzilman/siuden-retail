using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Siuden.Application.Validators.Auth;
using Siuden.Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;

namespace Siuden.Infrastructure;

public static class Extensions
{
    public static IServiceCollection AddInfrastructure(
       this IServiceCollection services,
       string connectionString)
    {
        services.AddDbContext<SiudenRetailDbContext>(options =>
            options.UseNpgsql(connectionString));

        

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
