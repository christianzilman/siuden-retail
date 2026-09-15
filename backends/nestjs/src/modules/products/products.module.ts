import { Module } from '@nestjs/common';
import { ImagesController } from './controllers/images.controller';
import { ProductsController } from './controllers/products.controller';
import { VariantsController } from './controllers/variants.controller';
import { ImagesService } from './services/images.service';
import { ProductsService } from './services/products.service';
import { VariantsService } from './services/variants.service';

@Module({
  controllers: [ProductsController, VariantsController, ImagesController],
  providers: [ProductsService, VariantsService, ImagesService],
})
export class ProductsModule {}
