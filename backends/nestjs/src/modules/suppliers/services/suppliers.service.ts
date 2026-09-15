import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import {
  paginated,
  paginationArgs,
} from '../../../common/helpers/pagination.helper';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { CreateSupplierDto, UpdateSupplierDto } from '../dto/supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, query: PaginationDto) {
    const where: Prisma.SupplierWhereInput = {
      tenantId,
      deletedAt: null,
      OR: query.search
        ? [
            { name: { contains: query.search } },
            { taxId: { contains: query.search } },
            { email: { contains: query.search } },
          ]
        : undefined,
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.supplier.findMany({
        where,
        ...paginationArgs(query),
        orderBy: { name: 'asc' },
      }),
      this.prisma.supplier.count({ where }),
    ]);
    return paginated(data, total, query);
  }

  async findOne(tenantId: string, id: string) {
    const supplier = await this.prisma.supplier.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!supplier) throw new NotFoundException('Proveedor no encontrado');
    return supplier;
  }

  create(tenantId: string, dto: CreateSupplierDto) {
    return this.prisma.supplier.create({
      data: {
        id: crypto.randomUUID(),
        tenantId,
        ...dto,
        name: dto.name.trim(),
        email: dto.email?.toLowerCase(),
      },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateSupplierDto) {
    await this.findOne(tenantId, id);
    return this.prisma.supplier.update({
      where: { id },
      data: { ...dto, name: dto.name?.trim(), email: dto.email?.toLowerCase() },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.supplier.update({
      where: { id },
      data: { status: 'ARCHIVED', deletedAt: new Date() },
    });
  }
}
