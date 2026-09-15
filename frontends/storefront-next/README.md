# Rubí Joyería — Storefront

Página pública multi-tenant construida con Next.js, TypeScript y Tailwind CSS. `/` y `/rubi/` consultan el catálogo público de NestJS por `tenantSlug`. Las categorías conservan rutas jerárquicas —por ejemplo, `/oro-18kt/pulseras/` y `/rubi/oro-18kt/pulseras/`— con catálogo, orden y paginación en el cliente.

El encabezado incluye creación de cuenta e inicio de sesión de clientes, accesibles también mediante `#register-modal` y `#login-modal`. Ambos formularios consumen `/api/v1/storefront/auth`, restauran la sesión mediante cookie `HttpOnly` y vinculan el usuario con `customers.user_id` dentro del tenant actual. Estas identidades no reciben roles administrativos.

Configurar `NEXT_PUBLIC_API_BASE_URL` usando `.env.example`; en desarrollo apunta a `http://localhost:3001/api/v1`.

## Desarrollo

```bash
pnpm install
npm run dev
```

Abrí `http://localhost:3000/rubi/` o `http://127.0.0.1:3000/`. Ambos orígenes admiten HMR durante el desarrollo.

## Producción

```bash
npm run build
```

La compilación genera la aplicación Next.js en `.next/`. En producción requiere el servidor Next para consultar la API en cada solicitud y reflejar cambios sin recompilar.

El contenido editorial vive en `src/config/tenants/`. La identidad editable, configuración pública, tema, canales, categorías, productos, variantes y existencias provienen de NestJS.

`src/features/catalog/api/catalog.api.ts` actúa como adaptador público sobre `GET /api/v1/storefront/catalog/:tenantSlug`, sin trasladar autenticación ni un `tenantId` editable al navegador.

## Organización por funcionalidades

```text
src/
├── app/                         # Rutas, metadata, layout y estilos de Next.js
├── features/
│   ├── auth/
│   │   ├── api/                 # Login, registro, sesión y logout
│   │   ├── components/          # Modal de acceso
│   │   ├── hooks/               # Estado y envío del formulario
│   │   ├── types/               # Sesión y payloads
│   │   └── validations/         # Reglas de formulario existentes
│   ├── catalog/
│   │   ├── api/                 # Lectura del catálogo público
│   │   ├── components/          # Productos, categorías, filtros y paginación
│   │   ├── pages/               # Presentación de una categoría
│   │   ├── types/               # Modelos públicos y respuesta de la API
│   │   └── utils/               # Árbol de categorías y adaptación de productos
│   ├── storefront/
│   │   ├── components/          # Encabezado, pie, portada y secciones comerciales
│   │   └── pages/               # Composición de la portada de la tienda
│   └── tenant/
│       ├── types/               # Configuración del comercio
│       └── utils/               # Resolución de tenant, tema y contacto
├── components/ui/               # Iconos y piezas visuales compartidas
├── config/tenants/              # Configuración editorial por comercio
├── data/tenants/                # Datos de referencia existentes
└── lib/                         # Transporte HTTP de auth y formato monetario
```

Las rutas siguen en `src/app`: consultan la API de catálogo y delegan la presentación a `features`. El catálogo conserva `fetch` del servidor con `cache: "no-store"`; auth conserva `fetch` con cookies desde el navegador. Se mantienen las fronteras `"use client"` de los componentes interactivos y hooks, sin convertir las páginas de servidor en componentes de cliente.

Para modificar el acceso, empezar por `features/auth/components/auth-modal.tsx`, `hooks/use-auth-form.ts`, `validations/auth.validation.ts` y `api/auth.api.ts`. Para modificar el catálogo, usar `features/catalog/`. Las funcionalidades importan tipos y utilidades desde su módulo propietario; `components/ui` contiene únicamente piezas reutilizables. Crear carpetas adicionales cuando exista una responsabilidad concreta, manteniendo React, Next.js, TypeScript y las dependencias actuales.

Verificación: `npm run typecheck` y `npm run build`. Este proyecto no tiene un script de lint configurado.
