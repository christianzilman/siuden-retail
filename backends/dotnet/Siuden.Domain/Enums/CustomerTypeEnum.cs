using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Siuden.Domain.Enums;

public enum CustomerTypeEnum
{
    [Description("Minorista")]
    Retail = 1,

    [Description("Mayorista")]
    Wholesale = 2,

    [Description("Solicitud mayorista pendiente")]
    PendingWholesale = 3
}
