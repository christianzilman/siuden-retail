using Siuden.Api;
using Siuden.Api.Middleware;
using Siuden.Application;
using Siuden.Infrastructure;
using Siuden.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);


//var postgresOptions =
//    builder.Configuration.GetOptions<PostgresOptions>("postgres");

var postgresOptions = builder.Configuration.GetRequiredSection("postgres").Get<PostgresOptions>()
    ?? throw new InvalidOperationException(
        "The 'postgres' configuration section was not found.");


ArgumentException.ThrowIfNullOrWhiteSpace(
    postgresOptions.ConnectionString);

// Application:
// MediatR, handlers, validators y behaviors.
builder.Services.AddApplication();

builder.Services.AddInfrastructure(postgresOptions.ConnectionString);


// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Más adelante:
// builder.Services.AddAuthentication(...)
//     .AddJwtBearer(...);

var app = builder.Build();

app.UseMiddleware<ErrorHandlerMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Cuando agreguemos JWT:
// app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
