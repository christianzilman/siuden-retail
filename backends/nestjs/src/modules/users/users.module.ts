import { Module } from '@nestjs/common';
import {
  PlatformAdminsController,
  UsersController,
} from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  controllers: [UsersController, PlatformAdminsController],
  providers: [UsersService],
})
export class UsersModule {}
