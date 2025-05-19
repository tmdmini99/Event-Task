import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway/gateway.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  // app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();