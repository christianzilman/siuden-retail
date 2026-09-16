using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Domain.Entities;

public class ProductVarient: AuditableEntity<long>
{
    public long ProductId { get; set; }
    public Product Product { get; set; }
    public string VarientName { get; set; }
    public string Sku {  get; set; }
    public string BarCode { get; set; }
    public decimal Stock {  get; set; }
    public decimal Price { get; set; }
    public decimal Cost { get; set; }
    public decimal WeightKg { get; set; }
    public decimal HeightCm { get; set; }
    public decimal WidthCm { get; set; }
    public decimal DepthCm { get; set; }
}
