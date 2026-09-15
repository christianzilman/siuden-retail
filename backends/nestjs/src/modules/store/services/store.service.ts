import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import {
  UpdateStoreContactsDto,
  UpdateStorefrontSettingsDto,
  UpdateStoreProfileDto,
  UpdateStoreThemeDto,
} from '../dto/store.dto';
import { StoreAssetsService } from './store-assets.service';

@Injectable()
export class StoreService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly assets: StoreAssetsService,
  ) {}

  async profile(tenantId: string) {
    const profile = await this.prisma.storeProfile.findUnique({
      where: { tenantId },
    });
    if (!profile) throw new NotFoundException('Perfil de tienda no encontrado');
    return profile;
  }

  async updateProfile(tenantId: string, dto: UpdateStoreProfileDto) {
    return this.prisma.storeProfile.upsert({
      where: { tenantId },
      create: { id: crypto.randomUUID(), tenantId, ...dto },
      update: dto,
    });
  }

  async settings(tenantId: string) {
    const value = await this.prisma.storefrontSetting.findUnique({
      where: { tenantId },
    });
    if (!value)
      throw new NotFoundException('Configuración de tienda no encontrada');
    return { ...value, catalogColumnsDesktop: value.catalogColumns };
  }

  async updateSettings(tenantId: string, dto: UpdateStorefrontSettingsDto) {
    const { catalogColumnsDesktop, ...data } = dto;
    const value = await this.prisma.storefrontSetting.upsert({
      where: { tenantId },
      create: {
        id: crypto.randomUUID(),
        tenantId,
        ...data,
        catalogColumns: catalogColumnsDesktop,
      },
      update: { ...data, catalogColumns: catalogColumnsDesktop },
    });
    return { ...value, catalogColumnsDesktop: value.catalogColumns };
  }

  async theme(tenantId: string) {
    const value = await this.prisma.storeTheme.findUnique({
      where: { tenantId },
    });
    if (!value) throw new NotFoundException('Tema de tienda no encontrado');
    return this.assets.themeView(tenantId, value);
  }

  async updateTheme(tenantId: string, dto: UpdateStoreThemeDto) {
    const value = await this.prisma.storeTheme.upsert({
      where: { tenantId },
      create: { id: crypto.randomUUID(), tenantId, ...dto },
      update: dto,
    });
    return this.assets.themeView(tenantId, value);
  }

  contacts(tenantId: string) {
    return this.prisma.storeContactChannel.findMany({
      where: { tenantId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async updateContacts(tenantId: string, dto: UpdateStoreContactsDto) {
    const types = dto.items.map((item) => item.channelType);
    if (new Set(types).size !== types.length) {
      throw new BadRequestException('No se puede repetir un tipo de canal');
    }
    await this.prisma.$transaction(async (tx) => {
      await tx.storeContactChannel.deleteMany({
        where: { tenantId, channelType: { notIn: types } },
      });
      for (const item of dto.items) {
        const { id, ...data } = item;
        await tx.storeContactChannel.upsert({
          where: {
            tenantId_channelType: { tenantId, channelType: item.channelType },
          },
          create: { id: id ?? crypto.randomUUID(), tenantId, ...data },
          update: data,
        });
      }
    });
    return this.contacts(tenantId);
  }
}
