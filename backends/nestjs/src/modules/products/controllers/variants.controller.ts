import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IdParamDto } from '../../../common/dto/id-param.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { AuthenticatedUser } from '../../auth/types/auth.types';
import { UpdateVariantDto } from '../dto/variant.dto';
import { VariantsService } from '../services/variants.service';

@ApiBearerAuth()
@ApiTags('product-variants')
@Controller('product-variants')
export class VariantsController {
  constructor(private readonly variants: VariantsService) {}

  @Permissions('products.write')
  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: IdParamDto,
    @Body() dto: UpdateVariantDto,
  ) {
    return this.variants.update(user.tenantId, params.id, dto);
  }

  @Permissions('products.write')
  @Delete(':id')
  remove(@CurrentUser() user: AuthenticatedUser, @Param() params: IdParamDto) {
    return this.variants.remove(user.tenantId, params.id);
  }
}
