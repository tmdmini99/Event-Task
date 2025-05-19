import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardRequestSchema } from './reward-request.schema';
import { RewardRequestService } from './reward-request.service';
import { RewardModule } from '../reward/reward.module'; 
@Module({
  imports: [MongooseModule.forFeature([{ name: 'RewardRequest', schema: RewardRequestSchema }]), RewardModule],
  providers: [RewardRequestService],
  exports: [RewardRequestService],
})
export class RewardRequestModule {}
