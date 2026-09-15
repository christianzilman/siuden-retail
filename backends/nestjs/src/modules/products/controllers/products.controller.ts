import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IdParamDto } from '../../../common/dto/id-param.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { AuthenticatedUser } from '../../auth/types/auth.types';
import { CreateProductImageDto } from '../dto/image.dto';
import {
  CreateProductDto,
  ProductQueryDto,
  UpdateProductDto,
} from '../dto/product.dto';
import { CreateVariantDto } from '../dto/variant.dto';
import { ImagesService } from '../services/images.service';
import { ProductsService } from '../services/products.service';
import { VariantsService } from '../services/variants.service';

@ApiBearerAuth()
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly products: ProductsService,
    private readonly variants: VariantsService,
    private readonly images: ImagesService,
  ) {}

  @Permissions('products.read')
  @Get()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ProductQueryDto,
  ) {
    return this.products.findAll(user.tenantId, query);
  }

  @Permissions('products.read')
  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param() params: IdParamDto) {
    return this.products.findOne(user.tenantId, params.id);
  }

  @Permissions('products.write')
  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateProductDto,
  ) {
    return this.products.create(user.tenantId, dto);
  }

  @Permissions('products.write')
  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
    @Body() dto: UpdateProductDto,
  ) {
    return this.products.update(user.tenantId, params.id, dto);
  }

  @Permissions('products.write')
  @Delete(':id')
  remove(@CurrentUser() user: AuthenticatedUser, @Param() params: IdParamDto) {
    return this.products.remove(user.tenantId, params.id);
  }

  @Permissions('products.write')
  @Post(':id/variants')
  createVariant(
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
    @Body() dto: CreateVariantDto,
  ) {
    return this.variants.create(user.tenantId, params.id, dto);
  }

  @Permissions('products.write')
  @Post(':id/images')
  createImage(
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
    @Body() dto: CreateProductImageDto,
  ) {
    return this.images.create(user.tenantId, params.id, dto);
  }
}
