using MediatR;
using Siuden.Application.Features.Products.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Products.Commands;

public record UpdateProductCommand(
    long ProductId,
    UpdateProductData Product)
    : IRequest;

