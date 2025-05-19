import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  // 사용자 이름으로 유저 찾기
  async findByUsername(name: string): Promise<User | null> {
    return this.userModel.findOne({ name }).exec();
  }

  // 사용자를 MongoDB에 저장
  async createUser(data: {
    name: string;
    password: string;
    role: string;
  }): Promise<User> {
    const user = new this.userModel(data);
    return user.save();
  }

}
