import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reward } from './reward.schema';

@Injectable()
export class RewardService {
  constructor(@InjectModel('Reward') private readonly model: Model<Reward>) {}

  async create(data: Partial<Reward>) {
    return new this.model(data).save();
  }

  async findAll() {
    return this.model.find().exec();
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.model.findById(new Types.ObjectId(id)).exec();
  }

  async findByEventId(eventId: string) {
    if (!Types.ObjectId.isValid(eventId)) return [];
    return this.model.find({ eventId: new Types.ObjectId(eventId) }).exec();
  }

  async decreaseQuantity(rewardId: string): Promise<Reward | null> {
    return this.model.findOneAndUpdate(
      {
        _id: rewardId,
        quantity: { $gt: 0 },
      },
      {
        $inc: { quantity: -1 },
      },
      { new: true }
    ).exec();
  }
}
