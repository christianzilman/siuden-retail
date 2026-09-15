# Siuden Retail — Backend NestJS

## Alcance

- Trabajar únicamente dentro de `backends/nestjs`.
- No modificar los frontends, `backends/dotnet`, la estructura raíz ni el SQL de la base salvo pedido explícito.
- Inspeccionar los archivos existentes antes de editar y preservar todo lo que funciona.
- Leer este archivo y `README.md` antes de implementar. Consultar `src/modules/README.md` para ubicar el dominio propietario.
- Inspeccionar `git status` y `git diff`; no sobrescribir cambios ajenos ni crear commits, ramas o pushes sin pedido explícito.

## Arquitectura obligatoria

- Mantener NestJS 11, TypeScript estricto, Prisma 6, MySQL 8, `class-validator`, `class-transformer`, Swagger, JWT y pnpm. La referencia de Cajora aporta la separación por responsabilidades; no copiar su router Express, Zod o procedures en reemplazo de las tecnologías de este backend.
- Los dominios viven en `src/modules/<dominio>/`. No agregar nuevos dominios directamente bajo `src/` ni reconstruir los antiguos archivos agrupados `catalog.controller.ts` o `purchases.controller.ts` con controladores de otros dominios.
- Cada módulo tiene `<dominio>.module.ts` en su raíz. Registrar allí sus controladores y proveedores. `src/app.module.ts` solamente compone módulos y guards globales; `src/main.ts` configura y arranca HTTP.
- `controllers/`: una clase controladora por archivo; decorators de rutas, permisos, Swagger, DTOs y delegación al servicio. No consultar Prisma desde un controlador ni añadir nuevas reglas de negocio o transacciones allí.
- `services/`: casos de uso, consultas Prisma y coordinación transaccional. Dividir por responsabilidad cuando haga falta; evitar un servicio que concentre dominios independientes.
- `dto/`: clases de entrada con `class-validator` y `class-transformer`. Usar `PartialType` para actualizaciones cuando corresponda. Conservar imports de valor para DTOs y providers usados por decorators e inyección; un `import type` puede eliminar metadata necesaria para Nest.
- `validations/`: reglas de negocio extraídas que no dependen de HTTP ni realizan consultas, por ejemplo restricciones de asignación de roles. Las validaciones de existencia/pertenencia consultan Prisma dentro del servicio y de la transacción cuando corresponda.
- `types/`: interfaces y contratos internos; no duplicar tipos generados de Prisma sin una necesidad concreta.
- `helpers/`: cálculos, adaptaciones y utilidades del dominio. Los helpers transaccionales reciben el `Prisma.TransactionClient` existente; no abren una transacción o conexión nueva.
- Crear solamente carpetas con contenido útil. No agregar capas `repository`, factories, barrels globales o abstracciones genéricas solo por uniformidad.
- `src/common/` es para DTOs, helpers, filtros, interceptores y utilidades usados por varios dominios. No convertirlo en un depósito de reglas comerciales.
- `src/infrastructure/prisma/` contiene la conexión y el ciclo de vida de Prisma. `prisma/` en la raíz del backend conserva schema y seeds. `src/config/` contiene validación/configuración del entorno.
- Usar imports relativos explícitos. Para inyectar un servicio de otro módulo, exportarlo desde su módulo e importar ese módulo; no volver a registrarlo como provider local ni crear dependencias circulares con `forwardRef` para eludir el diseño.
- Productos, variantes e imágenes pertenecen a `products`; categorías a `categories`; proveedores a `suppliers`; compras a `purchases`. El módulo `store` separa administración (`StoreService`), lectura pública (`StorefrontCatalogService`) y resolución de imágenes del tema (`StoreAssetsService`).

## Base de datos y Prisma

- MySQL 8 ya fue inicializado completamente con `database/init/001_initial_schema-siuden-retail-mysql8-schema.sql`.
- Usar pnpm 11 (`packageManager` en `package.json`); no mezclar `npm install` con el `node_modules` generado por pnpm.
- Si Windows no expone `pnpm` y Corepack no tiene permisos, usar `npx --yes pnpm@11.19.0 <comando>`.
- Ese SQL es la baseline y la fuente de verdad de la estructura física.
- No ejecutar `prisma migrate dev`, `prisma migrate reset`, `prisma db push` ni crear migraciones retrospectivas por defecto.
- Usar `pnpm prisma:validate` y `pnpm prisma:generate` después de cambiar `prisma/schema.prisma`.
- Antes de modificar el schema Prisma, contrastar nombres, tipos, precisión, enums, índices y nulabilidad con el SQL.
- Para introspección, usar `prisma db pull` solo sobre una copia y revisar el diff; no reemplazar el schema vigente sin revisión.
- El seed debe ser idempotente. Nunca incluir contraseñas o secretos reales en Git.
- El seed es un bootstrap explícito: no se ejecuta al iniciar la API y no debe resetear contraseñas salvo con `SEED_ADMIN_RESET_PASSWORD=true`.

## Seguridad multi-tenant

- Obtener `tenantId` exclusivamente del usuario autenticado; nunca confiar en un tenant recibido por body, query o header.
- Toda consulta y mutación sobre datos operativos debe filtrar por `tenantId`.
- Verificar que IDs relacionados pertenezcan al mismo tenant antes de escribir.
- Proteger endpoints administrativos con JWT y el permiso específico mediante `@Permissions()`.
- Conservar el orden global de `JwtAuthGuard`, `PermissionsGuard` y `GlobalAdminGuard`. `@Public()` es una excepción explícita, no una solución a un problema de inyección o autorización.
- Login administrativo puede recibir el tenant solicitado y verificar la membresía; ese dato no autoriza operaciones comerciales por sí solo. El catálogo público y el registro de clientes resuelven un tenant activo por `tenantSlug`/slug. Mantener separadas las cookies y los flujos administrativos y públicos.
- No incluir `passwordHash`, secretos ni credenciales en respuestas o logs.

## Reglas de dominio

- Los movimientos de stock publicados son inmutables: revertirlos con un movimiento opuesto, nunca borrarlos.
- Ventas, anulaciones y recepciones de compras deben actualizar documento, ítems, ledger y saldos en una única transacción.
- Mantener bloqueo de secuencias y saldos, y aislamiento `SERIALIZABLE` en operaciones críticas.
- Respetar borrado lógico donde existan `deletedAt`, estados archivados o deshabilitados.
- No permitir stock negativo salvo configuración del tenant o `allowBackorder` de la variante.

## Convenciones y verificación

- Mantener TypeScript estricto, módulos NestJS por dominio, DTOs con `class-validator` y errores HTTP consistentes.
- Agregar paginación, búsqueda y filtros a los listados que puedan crecer.
- Documentar endpoints nuevos en Swagger y actualizar `README.md` cuando cambie el contrato.
- Antes de finalizar ejecutar: `pnpm prisma:validate`, `pnpm prisma:generate`, `pnpm lint`, `pnpm typecheck`, `pnpm build` y `pnpm test --runInBand`. Reportar fallos y limitaciones con precisión.
- En Windows, `prisma generate` puede fallar con `EPERM` al reemplazar el motor si una API activa tiene cargada la DLL. No matar procesos ajenos ni cambiar el modo del motor para ocultar el error. Identificar y reportar el bloqueo; coordinar la liberación del proceso cuando sea necesario.
- Ubicar pruebas unitarias junto a la responsabilidad probada (`*.spec.ts`), y pruebas de composición entre módulos en `test/`. `test/module-wiring.spec.ts` verifica la inyección real de Nest, rutas, DTOs y permisos con Prisma sustituido por un doble, sin conectar a MySQL.
- Al mover controladores o providers, comprobar la composición de Nest y la metadata, además de TypeScript. Al tocar reglas de negocio, agregar pruebas de comportamiento y de límites de autorización; no pruebas que solo comprueben la existencia de carpetas.
- Una reorganización debe conservar URLs, verbos HTTP, cookies, permisos, respuestas y límites transaccionales. Actualizar imports de código, pruebas y documentación y revisar que no queden referencias a rutas antiguas.
- Si no hay credenciales MySQL, no inventarlas: dejar constancia de que seed y pruebas de integración quedaron pendientes.
