import { Schema, Document, Types } from 'mongoose';

export const UserEventLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  eventId: { type: Schema.Types.ObjectId, required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, 
  }
);

export interface UserEventLog extends Document {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  action: string;
  timestamp: Date;
  createdAt?: Date;
}
