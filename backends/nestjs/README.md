# Backend NestJS — Siuden Retail

API administrativa multi-tenant para Rubi Joyería. Usa NestJS, Prisma y la base MySQL 8 definida en `database/init/001_initial_schema-siuden-retail-mysql8-schema.sql`.

## Arquitectura y organización

El backend sigue la separación por dominio y responsabilidad usada como referencia en Cajora, adaptada a NestJS. Conserva sus tecnologías, contratos HTTP y reglas transaccionales. Los decorators de Nest definen las rutas y los DTOs con `class-validator` validan la entrada.

```text
src/
├── main.ts                         # Arranque, CORS, pipes, filtros y Swagger
├── app.module.ts                   # Composición y guards globales
├── config/
│   └── environment.validation.ts
├── infrastructure/prisma/          # PrismaModule y PrismaService
├── common/
│   ├── dto/                        # Parámetros y paginación de entrada
│   ├── helpers/                    # Adaptación de resultados paginados
│   ├── filters/
│   ├── interceptors/
│   └── utils/
└── modules/
    ├── accounts/
    ├── auth/
    ├── categories/
    ├── customers/
    ├── dashboard/
    ├── health/
    ├── inventory/
    ├── products/
    ├── purchases/
    ├── sales/
    ├── store/
    ├── storefront-auth/
    ├── suppliers/
    └── users/
prisma/                             # Schema y seeds existentes
test/                               # Pruebas de composición entre módulos
```

Cada dominio tiene un archivo `<dominio>.module.ts` y solamente las carpetas que necesita:

| Carpeta | Responsabilidad |
| --- | --- |
| `controllers/` | Entrada HTTP, permisos, Swagger y delegación al servicio. Una clase por archivo. |
| `services/` | Casos de uso, persistencia Prisma y transacciones. |
| `dto/` | Clases de entrada y validación con decorators. |
| `validations/` | Reglas de negocio independientes de consultas, como restricciones de roles. |
| `types/` | Contratos internos e identidad autenticada. |
| `helpers/` | Funciones y transformaciones del dominio, incluidos helpers transaccionales de stock. |
| `guards/`, `decorators/` | Autorización y metadata propias de autenticación. |

Flujo habitual:

```text
Ruta Nest + guards → DTO + ValidationPipe → controlador → servicio
                                                        ↓
                                        reglas/helpers + Prisma → MySQL
```

Los servicios reciben `PrismaService` por inyección. Los casos críticos mantienen una sola transacción y pasan su `tx` a los helpers. No se introducen repositorios genéricos ni wrappers que dupliquen Prisma.

Ejemplo: para modificar productos, empezar por `src/modules/products/controllers/products.controller.ts`, revisar `dto/product.dto.ts` y continuar en `services/products.service.ts`. Las variantes tienen su propio DTO y controlador dentro del mismo módulo. Categorías y proveedores tienen módulos independientes. La lectura pública de la tienda vive en `src/modules/store/services/storefront-catalog.service.ts`; los cambios administrativos siguen en `store.service.ts`.

Ver el [mapa de módulos](src/modules/README.md) y las [instrucciones obligatorias de desarrollo](AGENTS.md).

## Preparación

1. La base existente ya tiene aplicado por completo el SQL inicial. En una instalación nueva, aplicarlo una sola vez sobre una base MySQL 8 vacía.
2. Copiar `.env.example` a `.env` y completar `DATABASE_URL`, `JWT_SECRET` y las credenciales iniciales.
3. Instalar y generar el cliente:

   ```bash
   pnpm install
   pnpm prisma:validate
   pnpm prisma:generate
   pnpm prisma:seed
   pnpm start:dev
   ```

En Windows, si `pnpm` no aparece como comando y Corepack no tiene permisos para crear su caché, ejecutar los mismos comandos mediante el fallback local de npm:

   ```powershell
   npx --yes pnpm@11.19.0 install
   npx --yes pnpm@11.19.0 prisma:validate
   npx --yes pnpm@11.19.0 prisma:generate
   npx --yes pnpm@11.19.0 prisma:seed
   npx --yes pnpm@11.19.0 start:dev
   ```

Como alternativa permanente, abrir PowerShell como administrador y ejecutar `npm install --global pnpm@11.19.0`.

Este backend usa pnpm (`packageManager` está declarado en `package.json`) porque el lockfile y el árbol de dependencias del proyecto fueron generados con pnpm. No reutilizar ese `node_modules` con `npm i`: npm 11.9 puede fallar al deduplicar sus junctions con `Cannot read properties of null (reading 'matches')`. Si se desea cambiar a npm, primero hay que eliminar únicamente `backends/nestjs/node_modules` y generar un `package-lock.json` separado; no se deben mezclar ambos árboles.

El seed es idempotente y crea el administrador global indicado por `SEED_ADMIN_EMAIL`. Le asigna el rol de sistema `PLATFORM_ADMIN` y una membresía activa en todas las cuentas existentes, incluida Rubi. También garantiza los permisos de compras y administración de cuentas que la versión inicial del SQL todavía no incluía. La contraseña debe tener al menos 12 caracteres. El comando compila primero el seed y lo ejecuta como JavaScript para evitar problemas de carga de `tsx` en Windows.

En producción se ejecuta como un paso explícito de bootstrap después de configurar las variables de entorno; no se ejecuta al iniciar la API. Si el usuario ya existe, el seed conserva su contraseña. Para realizar un reset intencional, definir temporalmente `SEED_ADMIN_RESET_PASSWORD=true`, ejecutar el seed con una contraseña nueva y volver a dejar esa variable en `false`. La contraseña no se guarda en el SQL inicial ni debe actualizarse en texto plano directamente en MySQL: se almacena como hash bcrypt.

No debe ejecutarse `prisma migrate dev` contra la base existente: el SQL inicial es su línea base y contiene tablas futuras que esta primera API aún no consume. Para comprobar diferencias contra una instancia real puede usarse `pnpm prisma:pull` en una copia de trabajo y revisar el diff antes de conservarlo.

## Autenticación y tenancy

`POST /api/v1/auth/login` recibe `email`, `password` y opcionalmente `tenantId`. El JWT contiene la cuenta, el tenant, el rol y sus permisos; además se entrega en la cookie segura `HttpOnly` `siuden_admin_access_token` para el frontend administrativo. Un `PLATFORM_ADMIN` puede iniciar sesión indicando cualquiera de los tenants cuyas cuentas administra. `GET /api/v1/auth/me` restaura la sesión y `POST /api/v1/auth/logout` elimina la cookie. Los controladores operativos nunca aceptan un tenant libre por header o body: toman `tenantId` del token y todos los accesos operativos lo incluyen en su filtro.

Los endpoints administrativos protegidos aceptan `Authorization: Bearer <token>` o la cookie administrativa. Health, login, catálogo público y el controlador de autenticación del storefront tienen excepciones explícitas con `@Public()`. La sesión del storefront se verifica en su servicio con su propia cookie; esas excepciones no habilitan acceso administrativo. Swagger está disponible en `/docs`.

## Endpoints principales

- `GET /api/v1/health`
- `POST /api/v1/auth/login`, `GET /api/v1/auth/me`
- `POST /api/v1/storefront/auth/register`, `POST /api/v1/storefront/auth/login`
- `GET /api/v1/storefront/auth/me`, `POST /api/v1/storefront/auth/logout`
- `GET|POST /api/v1/accounts`, `GET /api/v1/accounts/:id` (solo `PLATFORM_ADMIN`)
- `GET|POST /api/v1/users`, `GET|PATCH /api/v1/users/:id`
- `GET /api/v1/users/roles`, `PATCH /api/v1/users/:id/role`
- `POST /api/v1/users/:id/reset-password`
- `POST /api/v1/users/platform-admins` (solo `PLATFORM_ADMIN`)
- `GET|POST /api/v1/categories`, `GET|PATCH|DELETE /api/v1/categories/:id`
- `GET|POST /api/v1/products`, `GET|PATCH|DELETE /api/v1/products/:id`
- `POST /api/v1/products/:id/variants`, `PATCH|DELETE /api/v1/product-variants/:id`
- `POST /api/v1/products/:id/images`, `DELETE /api/v1/product-images/:id`
- `GET|POST /api/v1/customers`, `GET|PATCH|DELETE /api/v1/customers/:id`
- `GET /api/v1/inventory/locations`, `GET /api/v1/inventory/balances`
- `GET|POST /api/v1/inventory/movements`
- `GET|POST /api/v1/sales`, `GET /api/v1/sales/:id`, `POST /api/v1/sales/:id/cancel`
- `GET|POST /api/v1/suppliers`, `GET|PATCH|DELETE /api/v1/suppliers/:id`
- `GET|POST /api/v1/purchases`, `GET /api/v1/purchases/:id`, `POST /api/v1/purchases/:id/receive`
- `GET /api/v1/dashboard`
- `GET|PUT /api/v1/store/profile|settings|theme|contacts`
- `GET /api/v1/storefront/catalog/:tenantSlug` (público)

El catálogo inicial puede completarse de forma independiente e idempotente con `pnpm prisma:seed:catalog`. Usa el tenant y la ubicación de Rubí por defecto; para otro destino se pueden definir `SEED_CATALOG_TENANT_ID` y `SEED_CATALOG_LOCATION_ID`. El script no modifica usuarios, contraseñas ni ventas existentes, y no sobrescribe el stock operativo cuando el balance ya existe.

Los listados aceptan `page`, `limit` (máximo 100) y `search`; los recursos principales agregan filtros propios documentados en Swagger.

## Usuarios administrativos

No existe un registro público de administradores. `PLATFORM_ADMIN` administra la plataforma completa; `OWNER`, `ADMIN`, `SELLER` y `STOCK_MANAGER` son membresías dentro de una cuenta. Un usuario puede pertenecer a más de una cuenta, pero cada membresía tiene su propio rol y estado.

`POST /api/v1/users` crea un usuario interno o agrega a la cuenta un usuario activo ya existente. El body requiere `email`, `password`, `displayName` y `roleCode`. La contraseña solo se usa cuando se crea una identidad nueva; nunca se sobrescribe al agregar una membresía existente. Un `ADMIN` no puede asignar ni modificar `OWNER`, y solo un `PLATFORM_ADMIN` puede administrar otro usuario global.

`PATCH /api/v1/users/:id` permite cambiar `displayName` y el `memberStatus` de la cuenta actual. Bloquear una membresía no bloquea las demás cuentas del usuario. El guard JWT vuelve a comprobar usuario, tenant, membresía, rol y permisos en cada request, por lo que el bloqueo y los cambios de rol tienen efecto inmediato.

Al crear una cuenta, `POST /api/v1/accounts` garantiza los cinco roles del sistema. Puede recibir opcionalmente un propietario inicial:

```json
{
  "accountName": "Nueva joyería",
  "tenantName": "Tienda principal",
  "slug": "nueva-joyeria",
  "owner": {
    "email": "owner@example.com",
    "password": "una-clave-de-al-menos-12",
    "displayName": "Propietario"
  }
}
```

Los clientes registrados en el storefront usan un flujo separado bajo `/api/v1/storefront/auth`. El registro recibe `tenantSlug`, nombre, apellido, email, contraseña y teléfono opcional; crea la identidad compartida en `users`, la vincula mediante `customers.user_id` únicamente al tenant solicitado y entrega la cookie `HttpOnly` `siuden_storefront_access_token`. Esos clientes no reciben membresías, roles administrativos ni acceso a `admin-react`. El carrito y los pedidos online continúan como una etapa posterior.

## Correspondencia de Prisma

`prisma/schema.prisma` mapea sin renombrar físicamente las tablas operativas existentes: identidad y tenant, catálogo, imágenes, saldos, secuencias, clientes, ventas, compras, proveedores y ledger de stock. Conserva `CHAR(36)`, precisión decimal, nombres de columnas, índices únicos y enums usados por la API.

Las tablas SaaS de facturación, configuración visual avanzada, carritos y pedidos online siguen perteneciendo al SQL inicial pero se dejaron fuera del cliente de esta etapa porque la API solicitada no las utiliza. Esto es válido en Prisma y evita introducir migraciones sobre una base existente.

## Reglas transaccionales

- Una venta se confirma junto con sus ítems, el movimiento `SALE` y el descuento de saldos.
- La anulación no borra el ledger: marca el movimiento original como `REVERSED` y crea `SALE_REVERSAL`.
- Una compra creada queda `ORDERED`; `/:id/receive` recibe todo lo pendiente, registra `PURCHASE` y actualiza saldos.
- Los números documentales se toman con bloqueo de fila y las operaciones de stock usan transacciones `SERIALIZABLE`.
## Reglas de equipo

1. Leer [AGENTS.md](AGENTS.md) antes de implementar y ubicar el módulo propietario.
2. Agregar o modificar el DTO de entrada y las reglas del dominio.
3. Implementar el caso de uso en su servicio conservando tenancy y transacciones.
4. Conectar el controlador con decorators de permisos y Swagger; registrar nuevos providers/controladores en el módulo y módulos nuevos en `AppModule`.
5. Reutilizar providers mediante `imports`/`exports` de Nest. Los imports de DTOs y clases inyectables deben existir en runtime para conservar la metadata de decorators.
6. Agregar pruebas de los comportamientos modificados y actualizar este README cuando cambien endpoints o arquitectura.

No cambiar el contrato HTTP como efecto secundario de mover archivos. `src/common` contiene responsabilidades transversales; las reglas comerciales permanecen en su dominio. Los archivos de configuración y seeds continúan en sus ubicaciones originales.

## Verificación

Desde `backends/nestjs`:

```bash
pnpm prisma:validate
pnpm prisma:generate
pnpm lint
pnpm typecheck
pnpm build
pnpm test --runInBand
```

`typecheck` incluye las pruebas; `build` genera producción excluyendo `test/` y `*.spec.ts`. Las pruebas unitarias viven junto al código. `test/module-wiring.spec.ts` ensambla los módulos reales con un doble de Prisma y comprueba rutas Swagger, DTOs y permisos; no requiere MySQL ni ejecuta seeds. Las pruebas de catálogo público verifican aislamiento por tenant y tiendas no publicadas; las de usuarios comprueban las restricciones de roles.

En Windows, una API en ejecución puede mantener bloqueado `query_engine-windows.dll.node` y causar `EPERM` durante `prisma generate`. Liberar el proceso que usa ese cliente antes de repetir la generación. No regenerar con otro modo de motor como solución improvisada ni detener procesos ajenos sin coordinación. La validación del schema y las pruebas con dobles no equivalen a una prueba de integración de transacciones contra MySQL.
