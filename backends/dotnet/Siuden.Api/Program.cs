using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Siuden.Api;
using Siuden.Api.Middleware;
using Siuden.Application;
using Siuden.Infrastructure;
using Siuden.Infrastructure.Authentication;
using Siuden.Infrastructure.Persistence;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

//var postgresOptions =
//    builder.Configuration.GetOptions<PostgresOptions>("postgres");

var postgresOptions = builder.Configuration.GetRequiredSection("postgres").Get<PostgresOptions>()
    ?? throw new InvalidOperationException(
        "The 'postgres' configuration section was not found.");


ArgumentException.ThrowIfNullOrWhiteSpace(
    postgresOptions.ConnectionString);

var jwtOptions = builder.Configuration
    .GetRequiredSection(JwtOptions.SectionName)
    .Get<JwtOptions>()
    ?? throw new InvalidOperationException(
        $"The '{JwtOptions.SectionName}' configuration section was not found.");

jwtOptions.Validate();

// Application:
// MediatR, handlers, validators y behaviors.
builder.Services.AddApplication();

builder.Services.AddInfrastructure(
    postgresOptions.ConnectionString,
    jwtOptions);


// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// M�s adelante:
// builder.Services.AddAuthentication(...)
//     .AddJwtBearer(...);


// JWT & Auth
var keyBytes = Encoding.UTF8.GetBytes(jwtOptions.Key);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
    options.SaveToken = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtOptions.Issuer,
        ValidAudience = jwtOptions.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ClockSkew = TimeSpan.FromMinutes(1)
    };
});




var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<SiudenRetailDbContext>();
    db.Database.Migrate();
}

app.UseMiddleware<ErrorHandlerMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
