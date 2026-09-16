using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Siuden.Infrastructure.Persistence;

/// <summary>
/// Provides EF Core tools with a DbContext outside the running API process.
/// </summary>
public sealed class SiudenRetailDbContextFactory
    : IDesignTimeDbContextFactory<SiudenRetailDbContext>
{
    public SiudenRetailDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("SIUDEN_POSTGRES_CONNECTION")
            ?? "Host=localhost;Port=5432;Database=siudenretail;Username=postgres";

        var options = new DbContextOptionsBuilder<SiudenRetailDbContext>()
            .UseNpgsql(connectionString)
            .Options;

        return new SiudenRetailDbContext(options);
    }
}
