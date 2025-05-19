// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
  // ConfigModule이 글로벌하게 설정되도록 앱이 시작되기 전에 로딩
  ConfigModule.forRoot({
    envFilePath: join(__dirname, '..', '..', '..', '.env'),
    isGlobal: true,
  })

  const app = await NestFactory.create(AuthModule);
  
  await app.listen(3001);
}
bootstrap();
