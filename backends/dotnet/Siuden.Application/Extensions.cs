using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Siuden.Application.Common.Behaviors;
using Siuden.Application.Validators.Auth;

namespace Siuden.Application;

public static class Extensions
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services)
    {
        services.AddMediatR(configuration =>
        {
            configuration.RegisterServicesFromAssembly(
                typeof(Extensions).Assembly);

            // Intercepta los requests enviados mediante MediatR.
            configuration.AddOpenBehavior(
                typeof(ValidationBehavior<,>));
        });

        services.AddValidatorsFromAssemblyContaining<
            LoginCommandValidator>();

        return services;
    }
}
