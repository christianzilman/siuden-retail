using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Categories.Commands;

public record RemoveCategoryCommand(
    Guid TenantId,
    Guid Id
) : IRequest;
