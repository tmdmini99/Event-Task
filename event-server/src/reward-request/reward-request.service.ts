import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RewardRequest } from './reward-request.schema';
import { RewardService } from '../reward/reward.service';

@Injectable()
export class RewardRequestService {
  constructor(
    @InjectModel('RewardRequest')
    private readonly model: Model<RewardRequest>,
    private readonly rewardService: RewardService,
  ) {}

  async create(data: Partial<RewardRequest>): Promise<RewardRequest> {
    return new this.model(data).save();
  }

  async findSuccessRequest(userId: string, eventId: Types.ObjectId, rewardId: Types.ObjectId) {
    return this.model.findOne({
      userId,
      eventId,
      rewardId,
      status: 'SUCCESS',
    }).exec();
  }

  async markAsSuccess(id: Types.ObjectId): Promise<RewardRequest | null> {
    const request = await this.model.findById(id);
    if (!request) return null;

    // 보상 수량 차감
    const updatedReward = await this.rewardService.decreaseQuantity(request.rewardId.toString());
    if (!updatedReward) {
      // 수량 부족하면 실패 처리
      return this.markAsFailed(id, '수량 부족');
    }

    // 성공 상태로 변경
    return this.model.findByIdAndUpdate(
      id,
      { status: 'SUCCESS' },
      { new: true }
    ).exec();
  }

  async markAsFailed(id: Types.ObjectId, reason: string): Promise<RewardRequest | null> {
    return this.model.findByIdAndUpdate(
      id,
      {
        status: 'FAILED',
        reason,
      },
      { new: true }
    ).exec();
  }

  async findByFilter(filter: { userId?: string; eventId?: string; status?: string }) {
    const query: any = {};
    if (filter.userId) query.userId = filter.userId;
    if (filter.eventId) query.eventId = new Types.ObjectId(filter.eventId);
    if (filter.status) query.status = filter.status;
    return this.model.find(query).exec();
  }
}
