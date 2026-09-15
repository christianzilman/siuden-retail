import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IdParamDto } from '../../../common/dto/id-param.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { AuthenticatedUser } from '../../auth/types/auth.types';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { CategoriesService } from '../services/categories.service';

@ApiBearerAuth()
@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Permissions('products.read')
  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.categories.findAll(user.tenantId);
  }

  @Permissions('products.read')
  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param() params: IdParamDto) {
    return this.categories.findOne(user.tenantId, params.id);
  }

  @Permissions('categories.write')
  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categories.create(user.tenantId, dto);
  }

  @Permissions('categories.write')
  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categories.update(user.tenantId, params.id, dto);
  }

  @Permissions('categories.write')
  @Delete(':id')
  remove(@CurrentUser() user: AuthenticatedUser, @Param() params: IdParamDto) {
    return this.categories.remove(user.tenantId, params.id);
  }

  @Permissions('categories.write')
  @Post('reorder')
  async reorder(
    @CurrentUser() user: AuthenticatedUser,
    @Body()
    items: Array<{ id: string; parentId: string | null; sortOrder: number }>,
  ) {
    for (const item of items)
      await this.categories.update(user.tenantId, item.id, item);
    return this.categories.findAll(user.tenantId);
  }
}
