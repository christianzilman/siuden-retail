import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { StoreAssetsService } from './store-assets.service';
import { StoreService } from './store.service';
import { StorefrontCatalogService } from './storefront-catalog.service';

describe('Catálogo público extraído', () => {
  function setup(published = true) {
    const prisma = {
      tenant: {
        findFirst: jest
          .fn()
          .mockResolvedValue({ id: 'tenant-a', slug: 'rubi' }),
      },
      storeProfile: { findUnique: jest.fn().mockResolvedValue(null) },
      storefrontSetting: {
        findUnique: jest
          .fn()
          .mockResolvedValue({ isPublished: published, catalogColumns: 4 }),
      },
      storeTheme: { findUnique: jest.fn().mockResolvedValue(null) },
      category: { findMany: jest.fn().mockResolvedValue([]) },
      product: { findMany: jest.fn().mockResolvedValue([]) },
      productVariant: { findMany: jest.fn().mockResolvedValue([]) },
      inventoryBalance: { findMany: jest.fn().mockResolvedValue([]) },
      productCategory: { findMany: jest.fn().mockResolvedValue([]) },
      productImage: { findMany: jest.fn().mockResolvedValue([]) },
      mediaAsset: { findMany: jest.fn().mockResolvedValue([]) },
    };
    const store = { contacts: jest.fn().mockResolvedValue([]) };
    const service = new StorefrontCatalogService(
      prisma as unknown as PrismaService,
      store as unknown as StoreService,
      {} as StoreAssetsService,
    );
    return { prisma, store, service };
  }

  it('filtra las consultas por el tenant resuelto y conserva el contrato público', async () => {
    const { prisma, store, service } = setup();
    const result = await service.publicCatalog('rubi');
    expect(prisma.tenant.findFirst).toHaveBeenCalledWith({
      where: { slug: 'rubi', status: 'ACTIVE', enabled: true },
    });
    for (const model of [
      prisma.product,
      prisma.category,
      prisma.productVariant,
      prisma.inventoryBalance,
      prisma.productCategory,
      prisma.productImage,
      prisma.mediaAsset,
    ]) {
      expect(model.findMany).toHaveBeenCalledTimes(1);
      const [query] = model.findMany.mock.calls[0] as [
        { where: { tenantId: string } },
      ];
      expect(query.where.tenantId).toBe('tenant-a');
    }
    expect(store.contacts).toHaveBeenCalledWith('tenant-a');
    expect(result.tenant.settings.catalogColumnsDesktop).toBe(4);
    expect(result.products).toEqual([]);
  });

  it('rechaza comercios inexistentes y tiendas sin publicar', async () => {
    const missing = setup();
    missing.prisma.tenant.findFirst.mockResolvedValue(null);
    await expect(missing.service.publicCatalog('missing')).rejects.toThrow(
      NotFoundException,
    );
    expect(missing.prisma.product.findMany).not.toHaveBeenCalled();
    const hidden = setup(false);
    await expect(hidden.service.publicCatalog('rubi')).rejects.toThrow(
      NotFoundException,
    );
    expect(hidden.prisma.productVariant.findMany).not.toHaveBeenCalled();
  });
});
