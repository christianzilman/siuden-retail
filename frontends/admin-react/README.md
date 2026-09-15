# Siuden Retail · Administrador

SPA administrativa de Siuden Retail para el comercio Rubí Joyería. Con `VITE_USE_MOCKS=false`, autenticación, cuentas, dashboard, catálogo, inventario, clientes, ventas y configuración consumen la API NestJS.

## Stack

- React, Vite y TypeScript estricto.
- React Router, TanStack Query y Axios.
- Zustand únicamente para el borrador compartido del POS.
- React Hook Form y Zod.
- Tailwind CSS, componentes estilo shadcn/Radix UI y Lucide React.

## Instalación y ejecución

Desde `frontends/admin-react/`:

```bash
npm install
npm run dev
```

Comprobaciones y compilación:

```bash
npm run lint
npm run typecheck
npm run build
npm run preview
```

`npm run build` genera la SPA estática en `dist/`. `npm run preview` sirve esa compilación localmente.

## Acceso

Con `VITE_USE_MOCKS=false`, usar el administrador creado por `backends/nestjs/prisma/seed.ts`. La contraseña nunca se incluye en este repositorio. NestJS entrega la sesión mediante una cookie `HttpOnly`, y el navegador restaura el acceso con `GET /api/v1/auth/me` sin guardar el bearer token en `localStorage`.

## Datos simulados y persistencia

El repositorio mock guarda el estado en `localStorage` bajo la clave `siuden-retail:admin:mock-database`. Productos, categorías, inventario, clientes ficticios, ventas y configuración permanecen al actualizar la página.

Para volver al seed inicial, abrí el menú de usuario en la barra superior y elegí **Restablecer datos de demostración**. La versión y el contenido inicial están en `src/mocks/seed.ts`; al cambiar su forma debe incrementarse `MOCK_DATA_VERSION`.

## Arquitectura de datos

El flujo de lectura y mutación en modo API es:

```text
Componente React
→ hook de TanStack Query (`src/features/<modulo>/hooks/`)
→ contratos del módulo (`src/features/<modulo>/types/contracts.ts`)
→ composición de servicios (`src/services/index.ts`)
→ API del módulo (`src/features/<modulo>/api/`)
→ cliente Axios compartido (`src/services/http-services.ts`)
→ API NestJS
```

Con `VITE_USE_MOCKS=true`, la composición sustituye el adaptador Axios por `src/services/mock-repository.ts` y su seed persistente.

Las pantallas no importan datos simulados directamente. Las query keys comerciales incluyen el tenant obtenido de la sesión.

### Integración progresiva con NestJS

Cada archivo `src/features/<modulo>/api/<modulo>.api.ts` implementa el contrato de su módulo. `src/services/create-http-services.ts` los conecta a una única instancia de Axios, configurada en `http-services.ts` con URL base, cookies y normalización de errores. `src/services/index.ts` solo crea el repositorio mock cuando `VITE_USE_MOCKS=true`; en modo API no existe fallback silencioso a datos locales.

## Organización por funcionalidades

```text
src/
├── app/                 # Providers, rutas y protección de acceso
├── features/
│   ├── accounts/
│   ├── auth/
│   ├── categories/
│   ├── customers/
│   ├── dashboard/
│   ├── demo/
│   ├── inventory/
│   ├── pos/
│   ├── products/
│   ├── sales/
│   └── settings/
├── components/          # Layout y UI compartida
├── services/            # Transporte, composición y repositorio mock
├── mocks/               # Seed local
├── types/               # Paginación, fechas y contratos transversales
└── lib/                 # Formatos, errores y claves de caché
```

Dentro de cada funcionalidad se crean solamente las carpetas necesarias:

- `pages/`: pantallas conectadas desde React Router, con carga diferida por página.
- `components/`: formularios, diálogos y secciones propios del módulo.
- `hooks/`: consultas, mutaciones y estado de interacción.
- `api/`: endpoints y adaptación de los payloads del módulo.
- `types/`: entidades, contratos y tipos de formularios.
- `validations/`: esquemas Zod, sin dependencias de componentes React.
- `utils/`: transformaciones y helpers del módulo.
- `store/`: borrador Zustand del POS.

Por ejemplo, para cambiar la creación de productos: la pantalla está en `features/products/pages/product-form-page.tsx`, las validaciones en `features/products/validations/products.schema.ts`, las mutaciones en `features/products/hooks/use-products.ts` y las peticiones en `features/products/api/products.api.ts`.

Importar directamente desde el módulo propietario. Los componentes consumen hooks; los hooks consumen los servicios seleccionados por `services/index.ts`. Las APIs reciben el cliente HTTP y dependen de su propio contrato. La composición global no debe acumular reglas de negocio. Los tipos entre módulos se importan con `import type`; las utilidades y validaciones no deben depender de páginas. Los helpers compartidos de ventas se reutilizan desde el POS.

Conservar las query keys comerciales con el tenant autenticado, la invalidación de inventario después de ventas y la alternativa mock al agregar operaciones. No crear carpetas vacías ni copiar componentes compartidos para cumplir el esquema.

La ruta `/accounts` aparece únicamente para `PLATFORM_ADMIN`, lista las cuentas reales y crea cuenta, tenant, roles y propietario mediante `POST /api/v1/accounts`.

## Variables de entorno

Copiá `.env.example` como `.env.local` y ajustá:

```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_USE_MOCKS=false
```

`VITE_API_BASE_URL` define la base de NestJS. Axios envía la cookie de sesión mediante `withCredentials`. Usar `VITE_USE_MOCKS=true` solamente para la demostración completamente local; con `false`, todos los módulos consumen datos reales.

## Fallback de SPA

`public/_redirects` incluye:

```text
/* /index.html 200
```

El hosting debe aplicar una reescritura equivalente para que rutas como `/products`, `/inventory` o `/pos` funcionen al actualizar directamente.
