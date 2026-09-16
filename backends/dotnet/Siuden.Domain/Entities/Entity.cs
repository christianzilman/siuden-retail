using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Domain.Entities;

// 1. Entidad base genérica (La "TId" representa el tipo de dato del Id)
public abstract class Entity<TId>
{
    public TId Id { get; set; }
}
