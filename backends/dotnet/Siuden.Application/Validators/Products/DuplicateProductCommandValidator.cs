using FluentValidation;
using Siuden.Application.Features.Products.Commands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Validators.Products;

public class DuplicateProductCommandValidator: AbstractValidator<DuplicateProductCommand>
{
    public DuplicateProductCommandValidator()
    {
        RuleFor(x => x.TenantId)
            .NotEmpty();

        RuleFor(x => x.ProductId)
            .GreaterThan(0);
    }
}
