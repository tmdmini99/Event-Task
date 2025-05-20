import { Schema, Document } from 'mongoose';

export const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  condition: {
    type: {
      type: String, // 'LOGIN_DAY_COUNT' 등
      required: true,
    },
    value: {
      type: Schema.Types.Mixed, // 숫자 등 유연한 타입
      required: true,
    },
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }

);

export interface Event extends Document {
  title: string;
  description?: string;
  condition: {
    type: string;
    value: any;
  };
  startDate: Date;
  endDate: Date;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: Date;
  updatedAt?: Date;
}
