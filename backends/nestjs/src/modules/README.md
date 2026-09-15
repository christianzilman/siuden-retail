# Mapa de módulos

La arquitectura general está en el [README del backend](../../README.md) y sus reglas de trabajo en [AGENTS.md](../../AGENTS.md).

| Módulo            | Responsabilidad y punto de entrada                                                                                                           |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `accounts`        | Cuentas, creación de tenant y propietario. `controllers/accounts.controller.ts`; permisos iniciales en `helpers/role-permissions.helper.ts`. |
| `auth`            | Sesión administrativa, JWT, guards globales, decorators y tipos de identidad.                                                                |
| `categories`      | Categorías, jerarquía y orden. `controllers/categories.controller.ts`.                                                                       |
| `products`        | Productos, opciones, variantes e imágenes. Controladores y servicios separados para productos, variantes e imágenes.                         |
| `customers`       | Clientes y direcciones; validación de nombre en `validations/customer-name.validation.ts`.                                                   |
| `inventory`       | Existencias, ubicaciones y movimientos. `helpers/inventory.utils.ts` concentra bloqueo de saldos y secuencias.                               |
| `sales`           | Confirmación y anulación de ventas con documento, ledger y saldos en una transacción.                                                        |
| `purchases`       | Compras y recepción de mercadería con movimiento de stock transaccional.                                                                     |
| `suppliers`       | Proveedores; conserva permisos `purchases.read` y `purchases.write`.                                                                         |
| `dashboard`       | Consultas y presentación del resumen administrativo.                                                                                         |
| `store`           | Perfil, preferencias, tema y contactos; catálogo público en `StorefrontCatalogService`; imágenes del tema en `StoreAssetsService`.           |
| `storefront-auth` | Registro, login y sesión de clientes públicos. Cookie y contexto separados del administrador.                                                |
| `users`           | Usuarios internos, membresías y roles. Restricciones de gestión/asignación en `validations/user-permissions.validation.ts`.                  |
| `health`          | Comprobación pública de salud existente.                                                                                                     |

## Dependencias y límites

- `AppModule` compone los módulos. Cada clase controladora se registra una sola vez en su módulo propietario.
- `PrismaModule`, en `infrastructure/prisma`, expone el cliente compartido. Las consultas operativas se filtran por tenant y las de identidad por su contexto de cuenta.
- Los controladores administrativos reutilizan decorators y tipos de `auth`. El catálogo público resuelve el tenant a partir del slug y comprueba que esté activo y publicado.
- Ventas y compras reutilizan los helpers transaccionales de inventario pasando el mismo `Prisma.TransactionClient`; nunca crear otro cliente o confirmar una parte de la operación antes que el resto.
- `StorefrontCatalogService` usa `StoreService` para contactos y `StoreAssetsService` para imágenes del tema. Ambos providers pertenecen a `StoreModule` y no dependen del servicio de catálogo público.
- Los DTOs siguen siendo clases con decorators. No reemplazarlos por interfaces: Swagger, `ValidationPipe` y Nest necesitan su metadata en runtime.
- Para consumir un provider de otro módulo, usar `exports` en el propietario e `imports` en el consumidor. No importar un controlador desde otro dominio ni registrar de nuevo su servicio.

No crear todas las carpetas por plantilla: `dto`, `validations`, `types` y `helpers` se agregan cuando existe contenido con esa responsabilidad. Los endpoints y respuestas se documentan en el README principal y Swagger.
