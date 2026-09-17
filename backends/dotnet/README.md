# Siuden Retail

Sistema de gestión comercial para productos, stock, ventas y pedidos.

## Arquitectura .NET

El backend utiliza .NET 8, PostgreSQL, Entity Framework Core, MediatR y FluentValidation.

```text
Siuden.Api
Siuden.Application
Siuden.Domain
Siuden.Infrastructure
```

## Alcance del MVP

- Una aplicación React consume una única API REST .NET.
- Las tiendas públicas se resuelven por slug: `siuden.com.ar/{tenantSlug}`.
- `/{tenantSlug}/admin` es el backoffice del comercio para `OWNER`, `ADMIN`, `SELLER` y `STOCK_MANAGER`.
- Cada `User` pertenece a un tenant y su email es único solamente dentro de esa tienda.
- Cada Account tiene un único Tenant operativo durante el MVP.
- El diseño completo está documentado en `../../docs/siuden-mvp-architecture.canvas.tsx`.

## API de identidad y acceso

```text
GET  /api/tenants/{tenantSlug}
POST /api/tenants/{tenantSlug}/customers
POST /api/tenants/{tenantSlug}/auth/customer/login
POST /api/tenants/{tenantSlug}/auth/staff/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
POST /api/account-members
GET  /api/account-members
PATCH /api/account-members/{memberId}
```

El registro público crea atómicamente `User` y `Customer` dentro del tenant.
`AccountMember` se reserva para el personal; el alta toma `AccountId` y
`TenantId` del JWT.
Los refresh tokens se rotan, se guardan como hash y se entregan en cookie
`HttpOnly`.

Las entidades y configuraciones de EF están preparadas, pero la migración
correspondiente debe generarse sólo después de revisar el modelo.
