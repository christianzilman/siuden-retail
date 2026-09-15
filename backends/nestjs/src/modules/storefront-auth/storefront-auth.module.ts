import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StorefrontAuthController } from './controllers/storefront-auth.controller';
import { StorefrontAuthService } from './services/storefront-auth.service';

@Module({
  imports: [AuthModule],
  controllers: [StorefrontAuthController],
  providers: [StorefrontAuthService],
})
export class StorefrontAuthModule {}
