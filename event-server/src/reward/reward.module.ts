import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardSchema } from './reward.schema';
import { RewardService } from './reward.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Reward', schema: RewardSchema }])],
  providers: [RewardService],
  exports: [RewardService],
})
export class RewardModule {}
