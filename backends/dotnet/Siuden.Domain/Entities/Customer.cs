using Siuden.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Domain.Entities;

public class Customer : AuditableEntity<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string SurName { get; set; } = string.Empty;
    public string? DocumentType { get; set; }
    public string? DocumentNumber { get; set; }
    public CustomerTypeEnum CustomerType { get; set; }
    public string? BusinessName { get; set; }
    public CustomerStatusEnum Status { get; set; }
    public Guid TenantId { get; set; }
    public Tenant Tenant { get; set; } = null!;

    // Opcional: puede ser un cliente local sin cuenta web
    public Guid? UserId { get; set; }
    public User? User { get; set; }

    // Contacto Comercial (Desnormalizado intencionalmente)
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }

    // Dirección
    public string? Street { get; set; }       // Dirección / Calle
    public string? StreetNumber { get; set; } // Número
    public string? Floor { get; set; }       // Piso (opcional)
    public string? Apartment { get; set; }   // Dpto (opcional)
    public string? City { get; set; }         // Ciudad
    public string? Province { get; set; }     // Provincia / State

    // Metadatos adicionales
    public string? Notes { get; set; }

}
