import { ForbiddenException } from '@nestjs/common';
import { AuthenticatedUser } from '../../auth/types/auth.types';

export function assertCanManageTarget(
  actor: AuthenticatedUser,
  targetRoleCode: string,
): void {
  if (
    targetRoleCode === 'PLATFORM_ADMIN' &&
    actor.roleCode !== 'PLATFORM_ADMIN'
  ) {
    throw new ForbiddenException(
      'Solo otro administrador global puede modificar este usuario',
    );
  }
  if (targetRoleCode === 'OWNER' && actor.roleCode === 'ADMIN') {
    throw new ForbiddenException(
      'Un administrador no puede modificar al propietario de la cuenta',
    );
  }
}

export function assertCanAssignRole(
  actor: AuthenticatedUser,
  roleCode: string,
): void {
  if (roleCode === 'OWNER' && actor.roleCode === 'ADMIN') {
    throw new ForbiddenException(
      'Solo el propietario o un administrador global puede asignar OWNER',
    );
  }
}
