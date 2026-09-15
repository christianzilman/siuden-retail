import { Module } from '@nestjs/common';
import { StoreController } from './controllers/store.controller';
import { StorefrontCatalogController } from './controllers/storefront-catalog.controller';
import { StoreAssetsService } from './services/store-assets.service';
import { StoreService } from './services/store.service';
import { StorefrontCatalogService } from './services/storefront-catalog.service';

@Module({
  controllers: [StoreController, StorefrontCatalogController],
  providers: [StoreService, StoreAssetsService, StorefrontCatalogService],
})
export class StoreModule {}
