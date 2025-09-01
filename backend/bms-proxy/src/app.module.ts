import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProxyModule } from './proxy/proxy.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [AuthModule, ProxyModule],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}
