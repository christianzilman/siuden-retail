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
    [<Code>POST /api/tenants/{"{slug}"}/customers</Code>, "CustomersController", "Crea User + Customer dentro del tenant", "Público"],
    [<Code>POST /api/tenants/{"{slug}"}/auth/customer/login</Code>, "AuthController", "Login del comprador en esa tienda", "Público"],
    [<Code>POST /api/tenants/{"{slug}"}/auth/staff/login</Code>, "AuthController", "Login del personal de esa tienda", "Público"],
    [<Code>POST /api/auth/refresh</Code>, "AuthController", "Renueva el contexto ya contenido en la sesión", "Refresh token"],
    [<Code>GET /api/auth/me</Code>, "AuthController", "Devuelve identidad, rol y contexto activo", "JWT"],
    [<Code>POST /api/account-members</Code>, "AccountMembersController", "OWNER/ADMIN crea o invita personal", "JWT + permiso"],
  ];

  const identityRows = [
    ["User", "Pertenece obligatoriamente a un Tenant", "UNIQUE (TenantId, Email)"],
    ["Customer", "Perfil comprador dentro de ese Tenant", "UNIQUE (TenantId, UserId)"],
    ["AccountMember", "Personal de la Account: OWNER, ADMIN, SELLER o STOCK_MANAGER", "CUSTOMER no es una membresía"],
    ["Mismo email", "Puede existir en Rubí y en Otra", "Son User.Id y contraseñas independientes"],
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

      <Callout tone="info" title="Identidad aislada por tienda">
        Un email identifica a una persona solamente dentro de un tenant. pepe@gmail.com en Rubí y pepe@gmail.com en Otra son usuarios independientes, con sus propias credenciales y datos.
      </Callout>

      <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap={16}>
        <RouteFlow
          title="Tienda pública"
          route="siuden.com.ar/rubi"
          audience="CUSTOMER"
          steps={[
            "React obtiene tenantSlug = rubi desde la URL",
            "La API carga diseño, catálogo y configuración del tenant",
            "El registro crea User + Customer dentro de Rubí",
            "El login emite una sesión vinculada a Rubí",
          ]}
        />
        <RouteFlow
          title="Panel administrativo"
          route="siuden.com.ar/rubi/admin"
          audience="STAFF"
          steps={[
            "El personal inicia sesión en /rubi/admin/login",
            "La API carga AccountMember, Role y el tenant del comercio",
            "React muestra módulos según permisos",
            "La API vuelve a comprobar permisos en cada operación",
          ]}
        />
      </Grid>

      <Stack gap={12}>
        <H2>Contrato mínimo de la API</H2>
        <Text tone="secondary">
          Ambos accesos son explícitos y reciben el slug. La API no intenta deducir una tienda a partir de un email que puede repetirse entre tenants.
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
          <Text><Text weight="semibold">CUSTOMER</Text> se obtiene desde Customer y nunca se guarda como AccountMember.</Text>
          <Text tone="secondary" size="small">
            Un superadministrador de la plataforma y una Account con varios tenants quedan fuera del MVP.
          </Text>
        </Stack>
      </Grid>

      <Stack gap={12}>
        <H2>Invariantes de identidad</H2>
        <Table
          headers={["Recurso", "Alcance", "Regla"]}
          rows={identityRows}
          rowTone={["info", "info", "neutral", "warning"]}
          striped
        />
      </Stack>

      <Callout tone="neutral" title="Orden de construcción">
        1. Cerrar invariantes e índices del modelo. 2. Registro de Customer. 3. Login contextual y autorización. 4. Gestión de AccountMembers. 5. Refresh/logout. 6. React con rutas /:tenantSlug y /:tenantSlug/admin.
      </Callout>
    </Stack>
  );
}
