import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
  ConfigModule.forRoot({
    envFilePath: join(__dirname, '..', '..', '..', '.env'),
    isGlobal: true,
  })
  const app = await NestFactory.create(AppModule);
  await app.listen(3002);
}
bootstrap();
