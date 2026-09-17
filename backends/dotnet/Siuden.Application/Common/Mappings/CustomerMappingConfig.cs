using Mapster;
using Siuden.Application.Features.Customers.DTOs;
using Siuden.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Application.Common.Mappings;

public class CustomerMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        // Mapeo hacia el DTO de respuesta detallada
        config.NewConfig<Customer, CustomerDto>()
            .Map(dest => dest.FirstName, src => src.Name)
            .Map(dest => dest.LastName, src => src.SurName);
    }
}
