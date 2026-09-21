using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Models.Storage;

public record StoredImage(
    string StorageKey,
    string Url);
