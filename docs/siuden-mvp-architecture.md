# Arquitectura MVP vigente

- La fuente visual de alcance es `docs/siuden-mvp-architecture.canvas.tsx`.
- El producto usa una aplicación React, una API REST .NET, una base de datos y múltiples tiendas por `tenantSlug`.
- `/:tenantSlug/*` es la tienda pública; `/:tenantSlug/admin/*` es el backoffice de ese comercio, no un panel global de Siuden.
- `CustomersController` registra compradores; `AccountMembersController` administra personal; `AuthController` autentica y mantiene sesiones.
- Los endpoints públicos resuelven el tenant por slug. Los endpoints protegidos toman `AccountId` y `TenantId` de la identidad autenticada.
- En el MVP, cada Account tiene un único Tenant operativo, aunque el modelo conserve la relación 1:N para el futuro.
- Todo `User` pertenece a un `Tenant`; el email es único por `(TenantId, Email)`, no globalmente.
- El mismo email en dos tenants representa dos usuarios independientes, incluso sus contraseñas pueden ser distintas.
- `Customer` representa al comprador del tenant. `AccountMember` contiene solamente personal y nunca una membresía `CUSTOMER`.
- CUSTOMER nunca accede al backoffice. OWNER puede crear ADMIN/SELLER/STOCK_MANAGER; ADMIN sólo SELLER/STOCK_MANAGER.
- Mantener dos logins explícitos y contextualizados por tenant en el mismo AuthController: `/api/tenants/{slug}/auth/customer/login` y `/api/tenants/{slug}/auth/staff/login`.
- La sesión web usa access token en memoria por 15 minutos y refresh token rotativo en cookie HttpOnly. El refresh vence tras 7 días de inactividad y la familia completa vence como máximo 30 días después del login original.
- El frontend realiza un único refresh al iniciar para reconstruir la sesión perdida al recargar y, durante la ejecución, sólo ante un `401`; las solicitudes concurrentes comparten la misma operación de refresh y cada petición se reintenta una sola vez.
- No introducir un BFF, superadministrador de plataforma, selector multi-tienda ni frontend por tenant sin un cambio explícito de alcance.
