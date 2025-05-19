import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserEventLog } from './user-event-log.schema';

@Injectable()
export class UserEventLogService {
  constructor(
    @InjectModel('UserEventLog') private readonly model: Model<UserEventLog>,
  ) {}

  async log(data: Partial<UserEventLog>) {
    return new this.model(data).save();
  }

  async findByUserId(userId: string) {
    return this.model.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  async countInvites(userId: string): Promise<number> {
    return this.model.countDocuments({
      userId: new Types.ObjectId(userId),
      action: 'INVITE_FRIEND',
    }).exec();
  }

  async logRewardGranted(userId: string, eventId: string, rewardId: string) {
    const logEntry = {
      userId: new Types.ObjectId(userId),
      eventId: new Types.ObjectId(eventId),
      rewardId: new Types.ObjectId(rewardId),
      action: 'REWARD_GRANTED',
      timestamp: new Date(),
    };
    return new this.model(logEntry).save();
  }
}
