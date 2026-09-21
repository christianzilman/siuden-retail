using Siuden.Application.Models.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Interfaces.Storage;

public interface IImageStorage
{
    Task<StoredImage> SaveAsync(
        Stream stream,
        string fileName,
        string contentType,
        string folder,
        CancellationToken cancellationToken = default);
    Task DeleteAsync(
        string storageKey,
        CancellationToken cancellationToken = default);
}
