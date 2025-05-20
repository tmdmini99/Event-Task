import { Schema, Document, Types } from 'mongoose';

export const RewardSchema = new Schema({
  eventId: { type: Types.ObjectId, ref: 'Event', required: true },
  type: { type: String, required: true }, // 포인트, 아이템, 쿠폰 등
  value: { type: String, required: true },
  quantity: { type: Number, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export interface Reward extends Document {
  eventId: Types.ObjectId;
  type: string;
  value: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}
