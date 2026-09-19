using Siuden.Domain.Entities;
using Siuden.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Features.Products.DTOs;

public class ProductListItemDto
{
    public long Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string Slug { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public decimal Stock { get; set; }

    public string? ImageUrl { get; set; }

    public DateTime CreatedAt { get; set; }
}
