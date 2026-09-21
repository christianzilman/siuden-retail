# Siuden Retail · Tienda pública

SPA pública multi-tenant de Siuden Retail. Cada comercio se resuelve mediante
`tenantSlug`, consulta la API REST .NET y ofrece el catálogo tanto a visitantes
como a clientes registrados.

## Stack

- React, Vite y TypeScript estricto.
- React Router, TanStack Query y Axios.
- Zustand para la sesión de cliente en memoria.
- React Hook Form y Zod.
- Tailwind CSS, componentes estilo shadcn/Radix UI y Lucide React.

## Instalación y ejecución

Desde `frontends/siuden-frontend/`:

```bash
npm install
npm run dev
```

Comprobaciones y compilación:

```bash
npm run lint
npm run build
npm run preview
```

`npm run build` ejecuta TypeScript y genera la SPA estática en `dist/`.

## Variables de entorno

Copiar `.env.example` como `.env.local` cuando sea necesario:

```env
VITE_API_URL=/
VITE_API_PROXY_TARGET=https://localhost:7053
```

- `VITE_API_URL` es la URL base usada por Axios. En desarrollo se recomienda
  `/` para mantener frontend y API bajo el mismo origen.
- `VITE_API_PROXY_TARGET` es el destino del proxy de Vite para `/api` y
  `/uploads`.

## Rutas públicas

- `/:tenantSlug`: home del comercio.
- `/:tenantSlug/productos`: catálogo completo.
- `/:tenantSlug/productos?categoria=<slug>`: catálogo filtrado por categoría.
- `orden=1..4` y `pagina=<n>` conservan el orden y la página en la URL.

La ruta `/` usa `rubi` como tenant de desarrollo. Las nuevas rutas públicas
deben permanecer bajo `/:tenantSlug/*`.

## API .NET

El storefront consume estos endpoints públicos:

- `GET /api/tenants/{tenantSlug}`
- `GET /api/categories/{tenantSlug}`
- `GET /api/products/{tenantSlug}`
- `POST /api/tenants/{tenantSlug}/customers`
- `POST /api/tenants/{tenantSlug}/auth/customer/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

Los parámetros del catálogo se envían como `CategoryId`, `SortBy`,
`Paging.PageNumber` y `Paging.PageSize`, según el contrato vigente de .NET.

## Sesión de cliente

El access token vive solamente en memoria. El refresh token es una cookie
`HttpOnly` administrada por el backend. Al iniciar la aplicación se intenta un
único refresh; durante la sesión, las respuestas `401` comparten una sola
operación de refresh y cada solicitud se reintenta como máximo una vez.

El login de clientes siempre está contextualizado por `tenantSlug`. El acceso
del personal al backoffice es un flujo separado y no pertenece a esta SPA.

## Flujo de datos

```text
Página o componente
→ hook de TanStack Query (`features/<feature>/hooks/`)
→ API del módulo (`features/<feature>/api/`)
→ cliente Axios compartido (`services/http-client.ts`)
→ API REST .NET
```

Los componentes no llaman endpoints directamente. Las query keys incluyen el
tenant y todos los filtros que cambian la respuesta. Los datos estáticos de
presentación pueden vivir en `data/`, pero no deben actuar como fallback
silencioso del catálogo real.

## Organización del código

```text
src/
├── app/                         # Providers y definición global de rutas
├── features/
│   ├── auth/
│   │   ├── api/
│   │   ├── components/
│   │   ├── store/
│   │   ├── types/
│   │   ├── validations/
│   │   └── index.ts
│   ├── catalog/
│   │   ├── api/
│   │   ├── components/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   └── storefront/
│       ├── components/
│       ├── pages/
│       ├── utils/
│       └── index.ts
├── components/                  # UI genérica y reutilizable
├── services/                    # Transporte HTTP y comportamiento transversal
├── lib/                         # Formatos y utilidades realmente compartidas
├── App.tsx
├── main.tsx
└── index.css
```

Dentro de cada feature se crean solamente las carpetas necesarias:

- `pages/`: pantallas conectadas desde React Router.
- `components/`: piezas visuales propias de la feature.
- `hooks/`: queries, mutations y estado de interacción reutilizable.
- `api/`: endpoints y adaptación de payloads del módulo.
- `types/`: entidades y contratos TypeScript del módulo.
- `validations/`: esquemas Zod independientes de React.
- `utils/`: funciones puras y transformaciones.
- `store/`: estado Zustand compartido dentro de la feature.
- `routes/`: configuración de rutas anidadas, únicamente si la feature la
  necesita.
- `data/`: contenido estático de presentación, no datos comerciales simulados.

No colocar archivos de implementación directamente en la raíz de una feature.
La única excepción es `index.ts`, que expone su API pública. Tampoco crear
carpetas vacías solo para imitar el esquema.

## Convenciones

- Componentes React y páginas: `PascalCase.tsx`.
- Archivos no visuales: nombre descriptivo con sufijo, por ejemplo
  `catalog.api.ts`, `auth.store.ts` o `auth.validation.ts`.
- Los tipos se importan con `import type`.
- Un helper permanece dentro de su feature hasta que tenga consumidores reales
  en más de una feature.
- `src/components/ui/` no contiene reglas de catálogo, tenant o autenticación.
- Toda pantalla remota contempla carga, error y estado vacío.
- Mantener navegación accesible, diseño responsive y filtros reflejados en la
  URL cuando deban sobrevivir a una recarga.

## Alcance del MVP

La arquitectura funcional completa está documentada en
`../../docs/siuden-mvp-architecture.md`. No agregar BFF, selector multi-tienda,
carrito, pedidos online ni acceso de personal desde este frontend sin un cambio
explícito de alcance.

## Hosting

El servidor que publique `dist/` debe reescribir las rutas desconocidas a
`index.html`, para que URLs como `/rubi/productos` funcionen al recargar.
