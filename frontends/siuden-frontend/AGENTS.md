# Tienda pública React

Estas reglas aplican exclusivamente a `frontends/siuden-frontend/`.

## Alcance y forma de trabajo

- Antes de modificar autenticación, tenants, clientes o rutas públicas, leer y
  respetar `../../docs/siuden-mvp-architecture.md`.
- Continuar sobre la implementación existente; no regenerar la aplicación ni
  reemplazar cambios válidos.
- Esta SPA consume la API REST .NET. No conectarla al backend NestJS ni mover
  responsabilidades a `admin-react` o `storefront-next`.
- Preservar cambios ajenos y revisar el diff antes de finalizar.
- No crear commits, ramas, tags ni hacer push salvo pedido explícito.
- Ejecutar `npm run lint` y `npm run build` después de cambios funcionales.

## Tecnologías

- React, Vite y TypeScript estricto.
- React Router para navegación.
- TanStack Query para estado remoto.
- Axios mediante `src/services/http-client.ts`; no usar `fetch` directamente
  desde componentes o hooks.
- Zustand solamente para estado de aplicación verdaderamente compartido, como
  la sesión en memoria; no duplicar datos remotos de TanStack Query.
- React Hook Form y Zod para formularios y validación.
- Tailwind CSS, componentes estilo shadcn/Radix UI y Lucide React.

## Organización por feature

- No dejar archivos de implementación en la raíz de `features/<feature>/`.
- La raíz puede contener únicamente `index.ts` como contrato público del
  módulo.
- Usar, solo cuando hagan falta, `api/`, `components/`, `hooks/`, `pages/`,
  `routes/`, `store/`, `types/`, `utils/`, `validations/` y `data/`.
- Usar `pages/` en plural; no alternar entre `page/` y `pages/`.
- No crear carpetas vacías para cumplir visualmente la estructura.
- Los componentes consumen hooks; los hooks consumen APIs del módulo; las APIs
  usan el cliente HTTP compartido.
- Mantener tipos, validaciones y utilidades independientes de páginas React.
- Importar tipos con `import type`.
- Mover un componente o helper a `src/components/` o `src/lib/` solamente si
  tiene consumidores reales en más de una feature.
- Los archivos de `data/` son contenido estático de presentación. Nunca deben
  ocultar un fallo del API ni reemplazar silenciosamente productos, categorías
  o tenants reales.

## Tenant, sesión y seguridad

- Todas las rutas de tienda viven bajo `/:tenantSlug/*` y los endpoints públicos
  resuelven el tenant por ese slug.
- No introducir selector global de tenant, BFF ni frontend separado por tienda.
- Mantener separados el login de clientes y el login del personal. Esta SPA usa
  `/api/tenants/{slug}/auth/customer/login`; nunca concede acceso al backoffice.
- El access token permanece en memoria. No guardarlo en `localStorage`,
  `sessionStorage` ni cookies accesibles desde JavaScript.
- Conservar un único refresh al iniciar y un único refresh compartido ante
  solicitudes concurrentes con `401`; cada solicitud se reintenta una sola vez.
- Las query keys de datos públicos incluyen `tenantSlug` y todos los filtros que
  alteran la respuesta.

## Catálogo e interfaz

- Consultar productos y categorías mediante sus endpoints .NET; no importar
  mocks comerciales desde las pantallas.
- Reflejar categoría, orden y página en la URL del catálogo.
- Mantener estados de carga, error y vacío, además de diseño responsive.
- Preservar navegación por teclado, labels, foco visible y atributos ARIA.
- Las imágenes remotas usan la URL entregada por el API; el fallback visual es
  solo de presentación y no crea productos ficticios.
- No implementar carrito, pagos, pedidos, reservas o envíos sin un cambio
  explícito de alcance.
