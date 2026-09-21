using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Categories.DTOs;

public record ReorderCategoryItem(
    Guid Id,
    Guid? ParentId,
    int SortOrder
);
