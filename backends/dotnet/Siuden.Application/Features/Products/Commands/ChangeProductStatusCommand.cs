using MediatR;
using Siuden.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Products.Commands;

public record ChangeProductStatusCommand(
    Guid TenantId,
    long ProductId,
    ProductStatusEnum Status)
    : IRequest;
