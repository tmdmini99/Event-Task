import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // 프록시 요청용
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ProxyService } from './proxy/proxy.service';

import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { AuthModule } from '../auth/auth.module'; // Auth 관련 모듈 연결 (선택)
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '..', '..', '..', '.env'),
      isGlobal: true,
    }),
    HttpModule,
    JwtModule.register({}), // JwtStrategy 동작 위해 필요, 옵션은 JwtStrategy에서 처리
    AuthModule,
  ],
  controllers: [GatewayController],
  providers: [
    GatewayService,
    ProxyService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class GatewayModule {}
