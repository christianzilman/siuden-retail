import { BadRequestException } from '@nestjs/common';

export function assertName(value: {
  firstName?: string | null;
  lastName?: string | null;
  businessName?: string | null;
}): void {
  if (!value.firstName && !value.lastName && !value.businessName) {
    throw new BadRequestException(
      'El cliente debe tener nombre, apellido o razón social',
    );
  }
}
