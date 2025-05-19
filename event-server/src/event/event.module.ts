import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './event.schema';
import { EventService } from './event.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }])],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
