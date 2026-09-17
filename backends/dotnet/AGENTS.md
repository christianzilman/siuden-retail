### AGENTS.md

```md
# AGENTS.md

## Objetivo

Trabajar incrementalmente sobre Siuden Retail, respetando la arquitectura existente y evitando agregar complejidad no solicitada.

## Reglas de arquitectura

- `Siuden.Api` contiene elementos HTTP: controllers, middleware, Swagger, configuración de autenticación JWT y autorización.
- `Siuden.Application` contiene commands, queries, handlers, DTOs, validators y behaviors.
- `Siuden.Domain` contiene entidades y reglas de dominio.
- `Siuden.Infrastructure` contiene EF Core, PostgreSQL, repositorios, generación de tokens JWT y servicios externos.
- Domain no debe depender de Application, Infrastructure ni API.
- Application no debe depender de Infrastructure ni API.

## Entity Framework

- No agregar atributos de EF Core a las entidades de Domain.
- Configurar claves, relaciones, índices y longitudes mediante `IEntityTypeConfiguration<T>`.
- Las claves de las entidades principales utilizan `Guid`.
- `UserRole` utiliza una clave primaria compuesta por `UserId` y `RoleId`.
- No crear migraciones hasta que las entidades y configuraciones estén revisadas.
- No crear, modificar ni eliminar migraciones de EF Core ni archivos SQL generados (por ejemplo, `initial-mvp.sql`) salvo que el usuario lo solicite explícitamente.
- La creación o aplicación de migraciones sólo se realiza cuando el usuario la indica de forma explícita.

## Dependency Injection

- Registrar Application mediante `AddApplication()`.
- Registrar Infrastructure mediante `AddInfrastructure()`.
- Registrar en `AddInfrastructure()` todas las implementaciones pertenecientes a Infrastructure, incluyendo `IJwtService`.
- Mantener `Program.cs` como composition root.
- No registrar MediatR ni FluentValidation dentro de Infrastructure.

## MediatR y validación

- Los validators deben validar el command enviado a MediatR.
- `LoginCommandValidator` debe implementar `AbstractValidator<LoginCommand>`.
- No combinar `LoginDtoValidator` con `ValidationBehavior<LoginCommand, TResponse>`.
- `ValidationBehavior` debe ejecutar los validators antes del handler.
- No utilizar `FluentValidationClientsideAdapters`, porque los clientes son React y Next.js.
- No utilizar auto-validation de MVC si la validación se ejecuta mediante MediatR.

## Excepciones

- `ValidationBehavior` lanza `ValidationException`.
- El middleware global transforma la excepción en HTTP 400.
- Las credenciales inválidas deben devolver HTTP 401.
- Los errores inesperados deben devolver HTTP 500 sin exponer detalles internos.

## Autenticación

- Mantener `JwtOptions` y la implementación `JwtService` dentro de `Siuden.Infrastructure`.
- Configurar `AddAuthentication()`, `AddJwtBearer()`, `UseAuthentication()` y autorización HTTP dentro de `Siuden.Api`.
- Nunca guardar contraseñas en texto plano.
- Guardar únicamente `PasswordHash`.
- Los roles son registros de la tabla `Roles`.
- Los roles iniciales previstos son `OWNER`, `ADMIN` y `SELLER`.
- El tenant debe obtenerse desde la identidad autenticada; no debe confiarse en un `TenantId` enviado por el cliente.

## Forma de trabajo

- Inspeccionar el código existente antes de modificarlo.
- Realizar cambios pequeños e incrementales.
- No crear abstracciones o módulos que todavía no sean necesarios.
- No reemplazar decisiones existentes sin explicar el motivo.
- Ejecutar compilación y pruebas después de los cambios.
- No modificar archivos ajenos a la tarea solicitada.
```
