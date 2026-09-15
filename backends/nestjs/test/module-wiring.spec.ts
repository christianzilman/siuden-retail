import 'reflect-metadata';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';
import { CategoriesController } from '../src/modules/categories/controllers/categories.controller';
import { ProductsController } from '../src/modules/products/controllers/products.controller';
import { SuppliersController } from '../src/modules/suppliers/controllers/suppliers.controller';
import { StorefrontCatalogController } from '../src/modules/store/controllers/storefront-catalog.controller';
import { PERMISSIONS_KEY } from '../src/modules/auth/decorators/permissions.decorator';
import { IS_PUBLIC_KEY } from '../src/modules/auth/decorators/public.decorator';

describe('Composición modular de la API', () => {
  let app: INestApplication;
  const environment = { ...process.env };

  beforeAll(async () => {
    // La prueba ensambla Nest sin conectar ni escribir en MySQL.
    process.env.DATABASE_URL = 'mysql://test:test@localhost:3306/test';
    process.env.JWT_SECRET = 'module-wiring-test-secret-at-least-32-characters';
    process.env.ADMIN_FRONTEND_URL = 'http://localhost:5173';
    const { AppModule } = await import('../src/app.module');
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
    process.env = environment;
  });

  it('resuelve proveedores y conserva rutas y DTOs de los dominios separados', () => {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle('Prueba').setVersion('1').build(),
    );
    const expected: Record<string, string[]> = {
      '/categories': ['get', 'post'],
      '/categories/{id}': ['get', 'patch', 'delete'],
      '/categories/reorder': ['post'],
      '/products': ['get', 'post'],
      '/products/{id}': ['get', 'patch', 'delete'],
      '/products/{id}/variants': ['post'],
      '/products/{id}/images': ['post'],
      '/product-variants/{id}': ['patch', 'delete'],
      '/product-images/{id}': ['delete'],
      '/suppliers': ['get', 'post'],
      '/suppliers/{id}': ['get', 'patch', 'delete'],
      '/purchases': ['get', 'post'],
      '/purchases/{id}/receive': ['post'],
      '/storefront/catalog/{slug}': ['get'],
      '/store/profile': ['get', 'put'],
      '/store/settings': ['get', 'put'],
      '/store/theme': ['get', 'put'],
      '/store/contacts': ['get', 'put'],
      '/health': ['get'],
    };
    for (const [route, methods] of Object.entries(expected)) {
      expect(
        Object.keys(document.paths[`/api/v1${route}`] ?? {}).sort(),
      ).toEqual(methods.sort());
    }
    expect(document.components?.schemas).toHaveProperty('CreateProductDto');
    expect(document.components?.schemas).toHaveProperty('CreateVariantDto');
    expect(document.components?.schemas).toHaveProperty('CreateSupplierDto');
  });

  it('conserva permisos administrativos y la marca pública del catálogo', () => {
    const creationPermissions = (controller: {
      prototype: object;
    }): unknown => {
      // Inspeccionar metadata no invoca ni desvincula el método de su instancia.
      const handler = Object.getOwnPropertyDescriptor(
        controller.prototype,
        'create',
      )?.value as object;
      return Reflect.getMetadata(PERMISSIONS_KEY, handler) as unknown;
    };
    expect(creationPermissions(CategoriesController)).toEqual([
      'categories.write',
    ]);
    expect(creationPermissions(ProductsController)).toEqual(['products.write']);
    expect(creationPermissions(SuppliersController)).toEqual([
      'purchases.write',
    ]);
    expect(
      Reflect.getMetadata(IS_PUBLIC_KEY, StorefrontCatalogController),
    ).toBe(true);
    expect(
      Reflect.getMetadata(IS_PUBLIC_KEY, ProductsController),
    ).toBeUndefined();
  });
});
