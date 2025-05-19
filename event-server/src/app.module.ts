// app.module.ts
import { Module } from '@nestjs/common';
import { EventController } from './event.controller'; 
import { EventModule } from './event/event.module';
import { RewardModule } from './reward/reward.module';
import { RewardRequestModule } from './reward-request/reward-request.module';
import { UserEventLogModule } from './user-event-log/user-event-log.module';
import { DatabaseModule } from './database/database.module'; 
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EventService } from './event.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: join(__dirname, '..', '..', '.env')
    }),
    DatabaseModule,
    EventModule,
    RewardModule,
    RewardRequestModule,
    UserEventLogModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),  // 이거 꼭 필요
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [EventController], 
  providers: [EventService, JwtStrategy],
})
export class AppModule {}
