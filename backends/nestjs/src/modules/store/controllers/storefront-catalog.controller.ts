import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/decorators/public.decorator';
import { StorefrontCatalogService } from '../services/storefront-catalog.service';

@Public()
@ApiTags('storefront')
@Controller('storefront/catalog')
export class StorefrontCatalogController {
  constructor(private readonly store: StorefrontCatalogService) {}

  @Get(':slug')
  catalog(@Param('slug') slug: string) {
    return this.store.publicCatalog(slug);
  }
}
