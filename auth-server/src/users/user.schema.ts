import { Schema, Document } from 'mongoose';

export const UserSchema = new Schema({
  name: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

export interface User extends Document {
  name: string;
  password: string;
  role: string;
}
