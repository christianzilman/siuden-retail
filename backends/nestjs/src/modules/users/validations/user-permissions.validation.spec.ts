import { ForbiddenException } from '@nestjs/common';
import type { AuthenticatedUser } from '../../auth/types/auth.types';
import {
  assertCanAssignRole,
  assertCanManageTarget,
} from './user-permissions.validation';

const actor = (roleCode: string): AuthenticatedUser => ({
  userId: 'user',
  accountId: 'account',
  tenantId: 'tenant',
  roleId: 'role',
  roleCode,
  email: 'test@example.com',
  displayName: 'Prueba',
  permissions: [],
});

describe('Reglas de administración de usuarios', () => {
  it('impide que ADMIN gestione o asigne OWNER y gestione PLATFORM_ADMIN', () => {
    expect(() => assertCanManageTarget(actor('ADMIN'), 'OWNER')).toThrow(
      ForbiddenException,
    );
    expect(() =>
      assertCanManageTarget(actor('ADMIN'), 'PLATFORM_ADMIN'),
    ).toThrow(ForbiddenException);
    expect(() => assertCanAssignRole(actor('ADMIN'), 'OWNER')).toThrow(
      ForbiddenException,
    );
  });

  it('conserva las operaciones permitidas a OWNER y PLATFORM_ADMIN', () => {
    expect(() => assertCanAssignRole(actor('OWNER'), 'OWNER')).not.toThrow();
    expect(() =>
      assertCanManageTarget(actor('PLATFORM_ADMIN'), 'PLATFORM_ADMIN'),
    ).not.toThrow();
    expect(() => assertCanManageTarget(actor('ADMIN'), 'SELLER')).not.toThrow();
  });
});
