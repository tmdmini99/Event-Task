// dto/create-reward.dto.ts
import { Types } from 'mongoose';

export class RewardDto {
  eventId: string; // or Types.ObjectId
  type: string; // 'point' | 'coupon' | 'item' 등
  amount: number;
}
