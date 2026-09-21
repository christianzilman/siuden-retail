using Microsoft.Extensions.Hosting;
using Siuden.Application.Interfaces.Storage;
using Siuden.Application.Models.Storage;

namespace Siuden.Infrastructure.Storage;

public class LocalImageStorage(
    IHostEnvironment environment)
    : IImageStorage
{
    public async Task<StoredImage> SaveAsync(
        Stream stream,
        string fileName,
        string contentType,
        string folder,
        CancellationToken cancellationToken = default)
    {
        var extension = Path.GetExtension(fileName);

        var generatedFileName =
            $"{Guid.NewGuid():N}{extension}";

        var webRootPath = Path.Combine(
            environment.ContentRootPath,
            "wwwroot");

        var relativeFolder = Path.Combine(
            "uploads",
            folder);

        var physicalFolder = Path.Combine(
            webRootPath,
            relativeFolder);

        Directory.CreateDirectory(physicalFolder);

        var physicalPath = Path.Combine(
            physicalFolder,
            generatedFileName);

        await using var output = File.Create(physicalPath);

        await stream.CopyToAsync(
            output,
            cancellationToken);

        var storageKey = Path.Combine(
                relativeFolder,
                generatedFileName)
            .Replace("\\", "/");

        return new StoredImage(
            storageKey,
            $"/{storageKey}");
    }

    public Task DeleteAsync(
        string storageKey,
        CancellationToken cancellationToken = default)
    {
        var webRootPath = Path.Combine(
            environment.ContentRootPath,
            "wwwroot");

        var physicalPath = Path.Combine(
            webRootPath,
            storageKey.Replace(
                "/",
                Path.DirectorySeparatorChar.ToString()));

        if (File.Exists(physicalPath))
        {
            File.Delete(physicalPath);
        }

        return Task.CompletedTask;
    }
}
