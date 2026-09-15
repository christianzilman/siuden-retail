import { Controller, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IdParamDto } from '../../../common/dto/id-param.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { AuthenticatedUser } from '../../auth/types/auth.types';
import { ImagesService } from '../services/images.service';

@ApiBearerAuth()
@ApiTags('product-images')
@Controller('product-images')
export class ImagesController {
  constructor(private readonly images: ImagesService) {}

  @Permissions('products.write')
  @Delete(':id')
  remove(@CurrentUser() user: AuthenticatedUser, @Param() params: IdParamDto) {
    return this.images.remove(user.tenantId, params.id);
  }
}
