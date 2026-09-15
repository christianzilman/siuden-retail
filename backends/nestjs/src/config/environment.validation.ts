export function validateEnvironment(
  config: Record<string, unknown>,
): Record<string, unknown> {
  for (const key of ['DATABASE_URL', 'JWT_SECRET', 'ADMIN_FRONTEND_URL']) {
    if (typeof config[key] !== 'string' || config[key].length === 0) {
      throw new Error(`La variable de entorno ${key} es obligatoria`);
    }
  }
  if ((config.JWT_SECRET as string).length < 32) {
    throw new Error('JWT_SECRET debe tener al menos 32 caracteres');
  }
  return config;
}
