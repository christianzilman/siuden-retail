import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class StoreAssetsService {
  constructor(private readonly prisma: PrismaService) {}
  async themeView(
    tenantId: string,
    value: {
      logoAssetId: string | null;
      faviconAssetId: string | null;
    } & Record<string, unknown>,
  ) {
    const ids = [value.logoAssetId, value.faviconAssetId].filter(
      (id): id is string => Boolean(id),
    );
    const assets = ids.length
      ? await this.prisma.mediaAsset.findMany({
          where: { tenantId, id: { in: ids }, status: 'ACTIVE' },
        })
      : [];
    const url = (id: string | null) => {
      const asset = assets.find((item) => item.id === id);
      return asset ? `/${asset.storageKey.replace(/^\/+/, '')}` : null;
    };
    return {
      ...value,
      logoUrl: url(value.logoAssetId),
      faviconUrl: url(value.faviconAssetId),
    };
  }
}
