import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEventLogSchema } from './user-event-log.schema';
import { UserEventLogService } from './user-event-log.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'UserEventLog', schema: UserEventLogSchema, collection: 'userEventLogs' }])],
  providers: [UserEventLogService],
  exports: [UserEventLogService],
})
export class UserEventLogModule {}
