// src/event/event.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event } from './event.schema';
import { EventDto, EventStatus } from './dto/event.dto';

@Injectable()
export class EventService {
  constructor(@InjectModel('Event') private readonly model: Model<Event>) {}

  async create(createEventDto: EventDto) {
    // 동일한 타입 조건의 이벤트 중복 검사 (value까지는 유연하게 허용 가능)
    const existing = await this.model.findOne({
      title: createEventDto.title,
      'condition.type': createEventDto.condition.type,
    });

    if (existing) {
      throw new BadRequestException('동일한 이벤트가 이미 존재합니다.');
    }

    const eventData: Partial<Event> = {
      title: createEventDto.title,
      description: createEventDto.description,
      condition: {
        type: createEventDto.condition.type,
        value: createEventDto.condition.value,
      },
      startDate: new Date(createEventDto.startDate),
      endDate: new Date(createEventDto.endDate),
      status: createEventDto.status,
    };

    return new this.model(eventData).save();
  }

  async findAll() {
    return this.model.find().exec();
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.model.findById(id).exec();
  }

  async findByStatus(status: EventStatus) {
    return this.model.find({ status }).exec();
  }
}
