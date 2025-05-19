import { Schema, Document, Types } from 'mongoose';

export const RewardRequestSchema = new Schema({
  userId: { type: String, required: true },
  eventId: { type: Types.ObjectId, ref: 'Event', required: true },
  rewardId: { type: Types.ObjectId, ref: 'Reward', required: true },
  status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
  reason: { type: String },
  requestedAt: { type: Date, default: Date.now },
});

export interface RewardRequest extends Document {
  userId: string;
  eventId: Types.ObjectId;
  rewardId: Types.ObjectId;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  reason?: string;
  requestedAt: Date;
}
