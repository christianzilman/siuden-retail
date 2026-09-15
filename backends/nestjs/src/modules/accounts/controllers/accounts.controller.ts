import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IdParamDto } from '../../../common/dto/id-param.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { GlobalAdmin } from '../../auth/decorators/global-admin.decorator';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { AuthenticatedUser } from '../../auth/types/auth.types';
import { AccountQueryDto, CreateAccountDto } from '../dto/account.dto';
import { AccountsService } from '../services/accounts.service';

@ApiBearerAuth()
@ApiTags('accounts')
@GlobalAdmin()
@Permissions('accounts.manage')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accounts: AccountsService) {}

  @Get()
  findAll(@Query() query: AccountQueryDto) {
    return this.accounts.findAll(query);
  }

  @Get(':id')
  findOne(@Param() params: IdParamDto) {
    return this.accounts.findOne(params.id);
  }

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAccountDto,
  ) {
    return this.accounts.create(user.userId, dto);
  }
}
