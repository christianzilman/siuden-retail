using FluentValidation;

namespace Siuden.Api.Middleware;

public sealed class ErrorHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlerMiddleware> _logger;

    public ErrorHandlerMiddleware(
        RequestDelegate next,
        ILogger<ErrorHandlerMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException exception)
        {
            await HandleValidationExceptionAsync(context, exception);
        }
        catch (Siuden.Application.Common.Exceptions.UnauthorizedException exception)
        {
            await WriteErrorAsync(context, StatusCodes.Status401Unauthorized, exception.Message);
        }
        catch (Siuden.Application.Common.Exceptions.ForbiddenException exception)
        {
            await WriteErrorAsync(context, StatusCodes.Status403Forbidden, exception.Message);
        }
        catch (Siuden.Application.Common.Exceptions.NotFoundException exception)
        {
            await WriteErrorAsync(context, StatusCodes.Status404NotFound, exception.Message);
        }
        catch (Siuden.Application.Common.Exceptions.ConflictException exception)
        {
            await WriteErrorAsync(context, StatusCodes.Status409Conflict, exception.Message);
        }
        catch (Exception exception)
        {
            _logger.LogError(
                exception,
                "An unexpected error occurred.");

            await HandleUnexpectedExceptionAsync(context);
        }
    }

    private static async Task HandleValidationExceptionAsync(
        HttpContext context,
        ValidationException exception)
    {
        var errors = exception.Errors
            .GroupBy(error => error.PropertyName)
            .ToDictionary(
                group => group.Key,
                group => group
                    .Select(error => error.ErrorMessage)
                    .Distinct()
                    .ToArray());

        context.Response.StatusCode =
            StatusCodes.Status400BadRequest;

        await context.Response.WriteAsJsonAsync(new
        {
            status = StatusCodes.Status400BadRequest,
            message = "Validation failed.",
            errors
        });
    }

    private static async Task HandleUnexpectedExceptionAsync(
        HttpContext context)
    {
        context.Response.StatusCode =
            StatusCodes.Status500InternalServerError;

        await context.Response.WriteAsJsonAsync(new
        {
            status = StatusCodes.Status500InternalServerError,
            message = "An unexpected error occurred."
        });
    }

    private static Task WriteErrorAsync(
        HttpContext context,
        int statusCode,
        string message)
    {
        context.Response.StatusCode = statusCode;
        return context.Response.WriteAsJsonAsync(new
        {
            status = statusCode,
            message
        });
    }
}
