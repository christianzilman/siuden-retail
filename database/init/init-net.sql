-- Siuden Retail - datos iniciales para PostgreSQL.
--
-- Requisito: ejecutar primero las migraciones de EF Core. Este archivo usa el
-- esquema vigente de backends/dotnet (tablas y columnas entre comillas).
-- Es idempotente: se puede ejecutar más de una vez sin duplicar registros.
--
-- Usuarios iniciales:
--   owner@rubijoyeria.local / Rubi2026!
--   admin@rubijoyeria.local / Rubi2026!
-- Cambiar estas credenciales inmediatamente fuera de desarrollo.

BEGIN;

-- Configuración visual y comercial incorporada al Tenant para el MVP. 

-- Estados (enteros): Account ACTIVE = 1, Tenant ACTIVE = 1, User ACTIVE = 1,
-- AccountMember ACTIVE = 1.
INSERT INTO "Accounts" ("Id", "Name", "Status", "CreatedAt")
VALUES (
    '11111111-1111-4111-8111-111111111111',
    'Rubi Joyeria',
    1,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("Id") DO UPDATE SET
    "Name" = EXCLUDED."Name",
    "Status" = EXCLUDED."Status",
    "UpdatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "Tenants" (
    "Id", "AccountId", "Name", "Slug", "BrandName", "ContactEmail",
    "Phone", "AddressLine", "AddressNumber", "City", "Province",
    "PostalCode", "CountryCode", "PrimaryColor", "SecondaryColor",
    "BackgroundColor", "TextColor", "HeadingFont", "BodyFont",
    "BorderRadius", "AnnouncementEnabled", "AnnouncementText",
    "AnnouncementUrl", "FaviconUrl", "LogoUrl", "Status", "CreatedAt"
)
VALUES (
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    'Rubi Joyeria',
    'rubi',
    'RUBI JOYERIA',
    'rubi.joyeria803@gmail.com',
    '3816776136',
    'Mendoza',
    '803',
    'San Miguel de Tucumán',
    'Tucumán',
    '4000',
    'AR',
    '#74263A',
    '#312A2B',
    '#F8F6F1',
    '#292526',
    'Georgia, serif',
    'Georgia, serif',
    '0.625rem',
    TRUE,
    'Envío gratis a todo San Miguel de Tucumán',
    'https://www.instagram.com/rubijoyerias',
    '/images/rubi-favicon.png',
    NULL,
    1,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("Id") DO UPDATE SET
    "AccountId" = EXCLUDED."AccountId",
    "Name" = EXCLUDED."Name",
    "Slug" = EXCLUDED."Slug",
    "BrandName" = EXCLUDED."BrandName",
    "ContactEmail" = EXCLUDED."ContactEmail",
    "Phone" = EXCLUDED."Phone",
    "AddressLine" = EXCLUDED."AddressLine",
    "AddressNumber" = EXCLUDED."AddressNumber",
    "City" = EXCLUDED."City",
    "Province" = EXCLUDED."Province",
    "PostalCode" = EXCLUDED."PostalCode",
    "CountryCode" = EXCLUDED."CountryCode",
    "PrimaryColor" = EXCLUDED."PrimaryColor",
    "SecondaryColor" = EXCLUDED."SecondaryColor",
    "BackgroundColor" = EXCLUDED."BackgroundColor",
    "TextColor" = EXCLUDED."TextColor",
    "HeadingFont" = EXCLUDED."HeadingFont",
    "BodyFont" = EXCLUDED."BodyFont",
    "BorderRadius" = EXCLUDED."BorderRadius",
    "AnnouncementEnabled" = EXCLUDED."AnnouncementEnabled",
    "AnnouncementText" = EXCLUDED."AnnouncementText",
    "AnnouncementUrl" = EXCLUDED."AnnouncementUrl",
    "FaviconUrl" = EXCLUDED."FaviconUrl",
    "LogoUrl" = EXCLUDED."LogoUrl",
    "Status" = EXCLUDED."Status",
    "UpdatedAt" = CURRENT_TIMESTAMP;

-- En el modelo .NET actual los roles son globales: no tienen AccountId ni
-- IsSystem. La asignación a la cuenta se realiza mediante AccountMembers.
INSERT INTO "Roles" ("Id", "Code", "Name", "Description", "CreatedAt")
VALUES
    ('40000000-0000-4000-8000-000000000001', 'OWNER', 'Propietario', 'Acceso completo a la cuenta.', CURRENT_TIMESTAMP),
    ('40000000-0000-4000-8000-000000000002', 'ADMIN', 'Administrador', 'Administra la tienda y su operación.', CURRENT_TIMESTAMP),
    ('40000000-0000-4000-8000-000000000003', 'SELLER', 'Vendedor', 'Opera ventas y clientes.', CURRENT_TIMESTAMP),
    ('40000000-0000-4000-8000-000000000004', 'STOCK_MANAGER', 'Responsable de stock', 'Administra catálogo e inventario.', CURRENT_TIMESTAMP),
    ('f434a158-79c9-4f8d-b362-367c44683f63', 'CUSTOMER', 'Cliente', 'Usuario registrado desde la tienda web.', CURRENT_TIMESTAMP)
ON CONFLICT ("Id") DO UPDATE SET
    "Code" = EXCLUDED."Code",
    "Name" = EXCLUDED."Name",
    "Description" = EXCLUDED."Description",
    "UpdatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "Permissions" ("Id", "Code", "Description", "CreatedAt")
VALUES
    ('50000000-0000-4000-8000-000000000001', 'store.read', 'Ver configuración de la tienda.', CURRENT_TIMESTAMP),
    ('50000000-0000-4000-8000-000000000002', 'store.update', 'Modificar configuración de la tienda.', CURRENT_TIMESTAMP),
    ('50000000-0000-4000-8000-000000000003', 'products.read', 'Ver productos.', CURRENT_TIMESTAMP),
    ('50000000-0000-4000-8000-000000000004', 'products.write', 'Crear y modificar productos.', CURRENT_TIMESTAMP),
    ('50000000-0000-4000-8000-000000000005', 'categories.write', 'Administrar categorías.', CURRENT_TIMESTAMP),
    ('50000000-0000-4000-8000-000000000006', 'inventory.read', 'Ver inventario.', CURRENT_TIMESTAMP),
    ('50000000-0000-4000-8000-000000000007', 'inventory.adjust', 'Registrar ajustes de inventario.', CURRENT_TIMESTAMP),
    ('50000000-0000-4000-8000-000000000008', 'customers.read', 'Ver clientes.', CURRENT_TIMESTAMP),
    ('50000000-0000-4000-8000-000000000009', 'customers.write', 'Crear y modificar clientes.', CURRENT_TIMESTAMP),
    ('50000000-0000-4000-8000-000000000010', 'sales.read', 'Ver ventas.', CURRENT_TIMESTAMP),
    ('50000000-0000-4000-8000-000000000011', 'sales.create', 'Registrar ventas.', CURRENT_TIMESTAMP),
    ('50000000-0000-4000-8000-000000000012', 'users.manage', 'Administrar usuarios y roles.', CURRENT_TIMESTAMP)
ON CONFLICT ("Id") DO UPDATE SET
    "Code" = EXCLUDED."Code",
    "Description" = EXCLUDED."Description",
    "UpdatedAt" = CURRENT_TIMESTAMP;

-- OWNER y ADMIN reciben todos los permisos existentes del seed.
INSERT INTO "RolePermissions" ("RoleId", "PermissionId", "CreatedAt")
SELECT role_id, permission_id, CURRENT_TIMESTAMP
FROM (
    SELECT '40000000-0000-4000-8000-000000000001'::uuid AS role_id, "Id" AS permission_id FROM "Permissions"
    UNION ALL
    SELECT '40000000-0000-4000-8000-000000000002'::uuid, "Id" FROM "Permissions"
) AS permissions_by_role
ON CONFLICT ("RoleId", "PermissionId") DO NOTHING;

INSERT INTO "RolePermissions" ("RoleId", "PermissionId", "CreatedAt")
SELECT '40000000-0000-4000-8000-000000000003'::uuid, "Id", CURRENT_TIMESTAMP
FROM "Permissions"
WHERE "Code" IN (
    'products.read', 'inventory.read', 'customers.read', 'customers.write',
    'sales.read', 'sales.create'
)
ON CONFLICT ("RoleId", "PermissionId") DO NOTHING;

INSERT INTO "RolePermissions" ("RoleId", "PermissionId", "CreatedAt")
SELECT '40000000-0000-4000-8000-000000000004'::uuid, "Id", CURRENT_TIMESTAMP
FROM "Permissions"
WHERE "Code" IN (
    'products.read', 'products.write', 'categories.write',
    'inventory.read', 'inventory.adjust'
)
ON CONFLICT ("RoleId", "PermissionId") DO NOTHING;

-- CUSTOMER no recibe permisos del panel administrativo ni genera una fila en
-- AccountMembers. El registro web crea Users + Customers dentro del Tenant.

-- PasswordHash fue generado con ASP.NET Core Identity v3 para Rubi2026!.
INSERT INTO "Users" (
    "Id", "TenantId", "Email", "PasswordHash", "Status", "EmailVerifiedAt", "CreatedAt"
)
VALUES
    (
        '30000000-0000-4000-8000-000000000001',
        '22222222-2222-4222-8222-222222222222',
        'owner@rubijoyeria.local',
        'AQAAAAEAAYagAAAAEMfQqCX6gbNZDoIqkcoNNLHfML1Jjx3u1dNca4O9SnH63esacfTn8Rg4YSqRNBzPEQ==',
        1,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '30000000-0000-4000-8000-000000000002',
        '22222222-2222-4222-8222-222222222222',
        'admin@rubijoyeria.local',
        'AQAAAAEAAYagAAAAEMfQqCX6gbNZDoIqkcoNNLHfML1Jjx3u1dNca4O9SnH63esacfTn8Rg4YSqRNBzPEQ==',
        1,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
ON CONFLICT ("Id") DO UPDATE SET
    "TenantId" = EXCLUDED."TenantId",
    "Email" = EXCLUDED."Email",
    "PasswordHash" = EXCLUDED."PasswordHash",
    "Status" = EXCLUDED."Status",
    "EmailVerifiedAt" = EXCLUDED."EmailVerifiedAt",
    "UpdatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "AccountMembers" (
    "Id", "AccountId", "UserId", "RoleId", "Status", "CreatedAt"
)
VALUES
    (
        '31000000-0000-4000-8000-000000000001',
        '11111111-1111-4111-8111-111111111111',
        '30000000-0000-4000-8000-000000000001',
        '40000000-0000-4000-8000-000000000001',
        1,
        CURRENT_TIMESTAMP
    ),
    (
        '31000000-0000-4000-8000-000000000002',
        '11111111-1111-4111-8111-111111111111',
        '30000000-0000-4000-8000-000000000002',
        '40000000-0000-4000-8000-000000000002',
        1,
        CURRENT_TIMESTAMP
    )
ON CONFLICT ("Id") DO UPDATE SET
    "AccountId" = EXCLUDED."AccountId",
    "UserId" = EXCLUDED."UserId",
    "RoleId" = EXCLUDED."RoleId",
    "Status" = EXCLUDED."Status",
    "UpdatedAt" = CURRENT_TIMESTAMP;

-- Categorías iniciales. Description es obligatoria en la migración actual.
INSERT INTO "Categories" (
    "Id", "TenantId", "ParentId", "Name", "Slug", "Description",
    "SortOrder", "IsVisible", "CreatedAt"
)
VALUES
    ('a0000000-0000-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', NULL, 'General', 'general', 'Productos generales.', 1, TRUE, CURRENT_TIMESTAMP),
    ('a0000000-0000-4000-8000-000000000002', '22222222-2222-4222-8222-222222222222', NULL, 'Oro 18kt', 'oro-18kt', 'Joyas elaboradas en oro de 18 quilates.', 2, TRUE, CURRENT_TIMESTAMP),
    ('a0000000-0000-4000-8000-000000000003', '22222222-2222-4222-8222-222222222222', NULL, 'Plata', 'plata', 'Joyas elaboradas en plata.', 3, TRUE, CURRENT_TIMESTAMP)
ON CONFLICT ("Id") DO UPDATE SET
    "TenantId" = EXCLUDED."TenantId",
    "ParentId" = EXCLUDED."ParentId",
    "Name" = EXCLUDED."Name",
    "Slug" = EXCLUDED."Slug",
    "Description" = EXCLUDED."Description",
    "SortOrder" = EXCLUDED."SortOrder",
    "IsVisible" = EXCLUDED."IsVisible",
    "UpdatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "Categories" (
    "Id", "TenantId", "ParentId", "Name", "Slug", "Description",
    "SortOrder", "IsVisible", "CreatedAt"
)
VALUES
    ('a0000000-0000-4000-8000-000000000011', '22222222-2222-4222-8222-222222222222', 'a0000000-0000-4000-8000-000000000002', 'Anillos', 'oro-18kt-anillos', 'Anillos de oro 18kt.', 1, TRUE, CURRENT_TIMESTAMP),
    ('a0000000-0000-4000-8000-000000000012', '22222222-2222-4222-8222-222222222222', 'a0000000-0000-4000-8000-000000000002', 'Pulseras', 'oro-18kt-pulseras', 'Pulseras de oro 18kt.', 2, TRUE, CURRENT_TIMESTAMP),
    ('a0000000-0000-4000-8000-000000000013', '22222222-2222-4222-8222-222222222222', 'a0000000-0000-4000-8000-000000000002', 'Dijes', 'oro-18kt-dijes', 'Dijes de oro 18kt.', 3, TRUE, CURRENT_TIMESTAMP),
    ('a0000000-0000-4000-8000-000000000014', '22222222-2222-4222-8222-222222222222', 'a0000000-0000-4000-8000-000000000002', 'Cadenas', 'oro-18kt-cadenas', 'Cadenas de oro 18kt.', 4, TRUE, CURRENT_TIMESTAMP),
    ('a0000000-0000-4000-8000-000000000015', '22222222-2222-4222-8222-222222222222', 'a0000000-0000-4000-8000-000000000002', 'Aros', 'oro-18kt-aros', 'Aros de oro 18kt.', 5, TRUE, CURRENT_TIMESTAMP),
    ('a0000000-0000-4000-8000-000000000016', '22222222-2222-4222-8222-222222222222', 'a0000000-0000-4000-8000-000000000002', 'Alianzas', 'oro-18kt-alianzas', 'Alianzas de oro 18kt.', 6, TRUE, CURRENT_TIMESTAMP),
    ('a0000000-0000-4000-8000-000000000017', '22222222-2222-4222-8222-222222222222', 'a0000000-0000-4000-8000-000000000002', 'Abridores', 'oro-18kt-abridores', 'Abridores de oro 18kt.', 7, TRUE, CURRENT_TIMESTAMP),
    ('a0000000-0000-4000-8000-000000000021', '22222222-2222-4222-8222-222222222222', 'a0000000-0000-4000-8000-000000000003', 'Anillos', 'plata-anillos', 'Anillos de plata.', 1, TRUE, CURRENT_TIMESTAMP)
ON CONFLICT ("Id") DO UPDATE SET
    "TenantId" = EXCLUDED."TenantId",
    "ParentId" = EXCLUDED."ParentId",
    "Name" = EXCLUDED."Name",
    "Slug" = EXCLUDED."Slug",
    "Description" = EXCLUDED."Description",
    "SortOrder" = EXCLUDED."SortOrder",
    "IsVisible" = EXCLUDED."IsVisible",
    "UpdatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "Categories" (
    "Id", "TenantId", "ParentId", "Name", "Slug", "Description",
    "SortOrder", "IsVisible", "CreatedAt"
)
VALUES (
    'a0000000-0000-4000-8000-000000000022',
    '22222222-2222-4222-8222-222222222222',
    'a0000000-0000-4000-8000-000000000021',
    'Iniciales',
    'plata-anillos-iniciales',
    'Anillos de plata personalizados con iniciales.',
    1,
    TRUE,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("Id") DO UPDATE SET
    "TenantId" = EXCLUDED."TenantId",
    "ParentId" = EXCLUDED."ParentId",
    "Name" = EXCLUDED."Name",
    "Slug" = EXCLUDED."Slug",
    "Description" = EXCLUDED."Description",
    "SortOrder" = EXCLUDED."SortOrder",
    "IsVisible" = EXCLUDED."IsVisible",
    "UpdatedAt" = CURRENT_TIMESTAMP;

COMMIT;
