using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Products.Commands;

public record DuplicateProductCommand(
    Guid TenantId,
    long ProductId)
    : IRequest<long>;

