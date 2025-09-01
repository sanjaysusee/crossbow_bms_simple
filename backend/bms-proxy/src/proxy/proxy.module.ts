import { Module } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { ProxyController } from './proxy.controller';
import { AuthModule } from '../auth/auth.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [AuthModule],
  controllers: [ProxyController],
  providers: [ProxyService, ConfigService],
})
export class ProxyModule {}
