import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IdParamDto } from '../../../common/dto/id-param.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { AuthenticatedUser } from '../../auth/types/auth.types';
import { CreatePurchaseDto, PurchaseQueryDto } from '../dto/purchase.dto';
import { PurchasesService } from '../services/purchases.service';

@ApiBearerAuth()
@ApiTags('purchases')
@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchases: PurchasesService) {}

  @Permissions('purchases.read')
  @Get()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: PurchaseQueryDto,
  ) {
    return this.purchases.findAll(user.tenantId, query);
  }

  @Permissions('purchases.read')
  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param() params: IdParamDto) {
    return this.purchases.findOne(user.tenantId, params.id);
  }

  @Permissions('purchases.write')
  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreatePurchaseDto,
  ) {
    return this.purchases.create(user.tenantId, user.userId, dto);
  }

  @Permissions('purchases.write')
  @Post(':id/receive')
  receive(@CurrentUser() user: AuthenticatedUser, @Param() params: IdParamDto) {
    return this.purchases.receive(user.tenantId, user.userId, params.id);
  }
}
