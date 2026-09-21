using MediatR;
using Siuden.Application.Features.Categories.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Categories.Commands;

public record ReorderCategoriesCommand(
    Guid TenantId,
    ICollection<ReorderCategoryItem> Items
) : IRequest<ICollection<CategoryDto>>;
