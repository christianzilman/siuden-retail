import {
  Callout,
  Card,
  CardBody,
  CardHeader,
  Code,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Stack,
  Table,
  Text,
  useHostTheme,
} from "cursor/canvas";

function RouteFlow({
  title,
  route,
  audience,
  steps,
}: {
  title: string;
  route: string;
  audience: string;
  steps: string[];
}) {
  const theme = useHostTheme();

  return (
    <Card size="lg">
      <CardHeader trailing={<Pill size="sm">{audience}</Pill>}>{title}</CardHeader>
      <CardBody>
        <Stack gap={12}>
          <Code>{route}</Code>
          <div style={{ display: "grid", gap: 8 }}>
            {steps.map((step, index) => (
              <div
                key={step}
                style={{
                  display: "grid",
                  gridTemplateColumns: "26px minmax(0, 1fr)",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    alignItems: "center",
                    background: index === 0 ? theme.accent.control : theme.fill.tertiary,
                    borderRadius: 9999,
                    color: index === 0 ? theme.text.onAccent : theme.text.secondary,
                    display: "flex",
                    fontSize: 12,
                    height: 24,
                    justifyContent: "center",
                    width: 24,
                  }}
                >
                  {index + 1}
                </div>
                <Text as="span" size="small" tone={index === 0 ? "primary" : "secondary"}>
                  {step}
                </Text>
              </div>
            ))}
          </div>
        </Stack>
      </CardBody>
    </Card>
  );
}

function ClaimBlock({ title, claims }: { title: string; claims: string[] }) {
  const theme = useHostTheme();

  return (
    <div style={{ borderLeft: `2px solid ${theme.stroke.secondary}`, paddingLeft: 14 }}>
      <H3>{title}</H3>
      <Row gap={6} wrap>
        {claims.map((claim) => (
          <Pill key={claim} size="sm">
            {claim}
          </Pill>
        ))}
      </Row>
    </div>
  );
}

export default function SiudenMvpArchitecture() {
  const theme = useHostTheme();

  const endpointRows = [
    [<Code>GET /api/tenants/{"{slug}"}</Code>, "TenantsController", "Configuración pública de la tienda", "Público"],
    [<Code>POST /api/tenants/{"{slug}"}/customers</Code>, "CustomersController", "Crea User + Customer + membresía CUSTOMER", "Público"],
    [<Code>POST /api/tenants/{"{slug}"}/auth/login</Code>, "AuthController", "Login del comprador en esa tienda", "Público"],
    [<Code>POST /api/auth/login</Code>, "AuthController", "Login del personal al backoffice", "Público"],
    [<Code>POST /api/auth/refresh</Code>, "AuthController", "Renueva el contexto ya contenido en la sesión", "Refresh token"],
    [<Code>GET /api/auth/me</Code>, "AuthController", "Devuelve identidad, rol y contexto activo", "JWT"],
    [<Code>POST /api/account-members</Code>, "AccountMembersController", "OWNER/ADMIN crea o invita personal", "JWT + permiso"],
  ];

  const gapRows = [
    ["JWT sin contexto", "Hoy sólo contiene UserId y email", "Agregar AccountId, TenantId, Role y CustomerId cuando corresponda"],
    ["Login sin membresía", "Hoy valida únicamente email y contraseña", "Cargar AccountMember/Customer antes de emitir el token"],
    ["Slug no único", "Tenant.Slug no tiene índice único configurado", "Definir unicidad y slugs reservados"],
    ["Registro incompleto", "Customer exige campos que la pantalla no solicita", "Volver opcionales los datos comerciales posteriores"],
    ["Sin refresh persistido", "No existe sesión renovable/revocable", "Agregar RefreshSession con hash y rotación"],
  ];

  return (
    <Stack gap={24} style={{ background: theme.bg.editor, color: theme.text.primary, minHeight: "100vh", padding: 28 }}>
      <Stack gap={8}>
        <Row align="center" gap={10} wrap>
          <H1>Siuden Retail · arquitectura MVP</H1>
          <Pill active>Decisión cerrada</Pill>
        </Row>
        <Text tone="secondary">
          Una aplicación React, una API REST .NET, una base de datos y múltiples tiendas resueltas por slug.
        </Text>
      </Stack>

      <Callout tone="info" title="Qué significa /admin">
        Es el backoffice de cada comercio. OWNER, ADMIN, SELLER y STOCK_MANAGER usan el mismo panel; la API limita sus acciones por rol y permisos. No es un superadministrador global de Siuden.
      </Callout>

      <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap={16}>
        <RouteFlow
          title="Tienda pública"
          route="siuden.com.ar/rubi"
          audience="CUSTOMER"
          steps={[
            "React obtiene tenantSlug = rubi desde la URL",
            "La API carga diseño, catálogo y configuración del tenant",
            "El registro crea User + Customer + AccountMember(CUSTOMER)",
            "El login emite una sesión vinculada a Rubí",
          ]}
        />
        <RouteFlow
          title="Panel administrativo"
          route="siuden.com.ar/admin"
          audience="STAFF"
          steps={[
            "El personal inicia sesión en /admin/login",
            "La API carga AccountMember, Role y el tenant del comercio",
            "React muestra módulos según permisos",
            "La API vuelve a comprobar permisos en cada operación",
          ]}
        />
      </Grid>

      <Stack gap={12}>
        <H2>Contrato mínimo de la API</H2>
        <Text tone="secondary">
          Dos rutas de login explícitas en el mismo AuthController evitan la regla oculta “tenantSlug nulo significa administrador”. El código común de credenciales puede reutilizarse internamente.
        </Text>
        <Table
          headers={["Endpoint", "Controlador", "Responsabilidad", "Acceso"]}
          rows={endpointRows}
          rowTone={["info", "info", "info", "neutral", "neutral", "neutral", "warning"]}
          striped
        />
      </Stack>

      <Divider />

      <Grid columns="repeat(auto-fit, minmax(280px, 1fr))" gap={24}>
        <Stack gap={14}>
          <H2>Contexto de los tokens</H2>
          <Text tone="secondary">
            No hace falta un claim session_type en el MVP: el rol distingue el contexto. Cada token representa una sola sesión activa.
          </Text>
          <ClaimBlock title="Comprador" claims={["sub", "role=CUSTOMER", "account_id", "tenant_id", "customer_id"]} />
          <ClaimBlock title="Personal" claims={["sub", "role=OWNER|ADMIN|SELLER|STOCK_MANAGER", "account_id", "tenant_id"]} />
        </Stack>

        <Stack gap={14}>
          <H2>Alcance deliberado del MVP</H2>
          <Callout tone="success" title="Supuesto que mantiene todo simple">
            Una Account tiene un único Tenant operativo en el MVP. Hay muchas tiendas en Siuden, pero cada comercio administra una sola. Así el login administrativo puede resolver TenantId sin selector de tienda.
          </Callout>
          <Text><Text weight="semibold">OWNER</Text> puede crear ADMIN, SELLER y STOCK_MANAGER.</Text>
          <Text><Text weight="semibold">ADMIN</Text> puede crear SELLER y STOCK_MANAGER.</Text>
          <Text><Text weight="semibold">CUSTOMER</Text> nunca accede a rutas administrativas.</Text>
          <Text tone="secondary" size="small">
            Un superadministrador de la plataforma y una Account con varios tenants quedan fuera del MVP.
          </Text>
        </Stack>
      </Grid>

      <Stack gap={12}>
        <H2>Brecha entre el modelo actual y el MVP</H2>
        <Table
          headers={["Tema", "Estado actual", "Cambio necesario"]}
          rows={gapRows}
          rowTone={["warning", "warning", "warning", "warning", "warning"]}
          striped
        />
      </Stack>

      <Callout tone="neutral" title="Orden de construcción">
        1. Cerrar invariantes e índices del modelo. 2. Registro de Customer. 3. Login contextual y autorización. 4. Gestión de AccountMembers. 5. Refresh/logout. 6. React con rutas /:tenantSlug y /admin.
      </Callout>
    </Stack>
  );
}