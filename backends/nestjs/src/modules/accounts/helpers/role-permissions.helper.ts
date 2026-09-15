export function permissionCodesForRole(roleCode: string): string[] {
  if (roleCode === 'PLATFORM_ADMIN') return [];
  const common = [
    'store.read',
    'products.read',
    'inventory.read',
    'customers.read',
    'sales.read',
  ];
  if (roleCode === 'OWNER' || roleCode === 'ADMIN') {
    return [
      ...common,
      'store.update',
      'store.theme.update',
      'products.write',
      'categories.write',
      'inventory.adjust',
      'customers.write',
      'sales.create',
      'sales.cancel',
      'pos.use',
      'orders.manage',
      'users.manage',
      'roles.manage',
      'purchases.read',
      'purchases.write',
    ];
  }
  if (roleCode === 'SELLER') {
    return [...common, 'customers.write', 'sales.create', 'pos.use'];
  }
  return [
    'products.read',
    'products.write',
    'categories.write',
    'inventory.read',
    'inventory.adjust',
    'purchases.read',
    'purchases.write',
  ];
}
