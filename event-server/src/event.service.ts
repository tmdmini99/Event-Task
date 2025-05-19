import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { EventService as EventModelService } from './event/event.service';
import { RewardService } from './reward/reward.service';
import { RewardRequestService } from './reward-request/reward-request.service';
import { UserEventLogService } from './user-event-log/user-event-log.service';

import { EventDto, EventStatus } from './event/dto/event.dto';
import { RewardDto } from './reward/dto/reward.dto';
import { RewardRequestDto } from './reward-request/dto/reward-request.dto';

@Injectable()
export class EventService {
  constructor(
    private readonly eventModelService: EventModelService,
    private readonly rewardService: RewardService,
    private readonly rewardRequestService: RewardRequestService,
    private readonly userEventLogService: UserEventLogService,
  ) {}

  async createEvent(createEventDto: EventDto) {
    return this.eventModelService.create(createEventDto);
  }

  async findEvents(status?: EventStatus) {
    if (status) {
      return this.eventModelService.findByStatus(status);
    }
    return this.eventModelService.findAll();
  }

  async findEventById(eventId: string) {
    return this.eventModelService.findById(eventId);
  }

  async findRewards(eventId?: string) {
    if (eventId) {
      return this.rewardService.findByEventId(eventId);
    }
    return this.rewardService.findAll();
  }

  async createReward(createRewardDto: RewardDto) {
    const event = await this.eventModelService.findById(createRewardDto.eventId);
    if (!event) throw new NotFoundException('Event not found');

    return this.rewardService.create({
      ...createRewardDto,
      eventId: event.id,
    });
  }

  async requestReward(dto: RewardRequestDto & { userId: string }) {
    const { userId, eventId, rewardId } = dto;
    const event = await this.eventModelService.findById(eventId);
    if (!event) throw new NotFoundException('Event not found');

    const reward = await this.rewardService.findById(rewardId);
    if (!reward) throw new NotFoundException('Reward not found');

    const existingRequest = await this.rewardRequestService.findSuccessRequest(userId, event.id, reward.id);
    if (existingRequest) {
      await this.rewardRequestService.create({
        userId,
        eventId: event.id,
        rewardId: reward.id,
        status: 'FAILED',
        reason: '이미 보상 요청을 했습니다.',
        requestedAt: new Date(),
      });
      throw new BadRequestException('이미 보상 요청을 했습니다.');
    }

    const now = new Date();
    if (event.status !== 'ACTIVE') {
      await this.rewardRequestService.create({
        userId,
        eventId: event.id,
        rewardId: reward.id,
        status: 'FAILED',
        reason: '이벤트가 활성 상태가 아닙니다.',
        requestedAt: new Date(),
      });
      throw new BadRequestException('Event is not active');
    }

    if (now < new Date(event.startDate) || now > new Date(event.endDate)) {
      await this.rewardRequestService.create({
        userId,
        eventId: event.id,
        rewardId: reward.id,
        status: 'FAILED',
        reason: '이벤트 기간이 아닙니다.',
        requestedAt: new Date(),
      });
      throw new BadRequestException('Event period is not valid');
    }

    const userLogs = await this.userEventLogService.findByUserId(userId);
    console.log("userID : ", userId);
    const inviteCount = await this.userEventLogService.countInvites(userId);
    console.log("inviteCount : ", inviteCount);

    console.log("event.condition typeof:", typeof event.condition);
    console.log("event.condition (raw):", event.condition);

    const condition = typeof event.condition === 'string'
      ? JSON.parse(event.condition)
      : event.condition;

    const passed = await this.evaluateCondition(condition, userLogs, inviteCount);
    if (!passed.success) {
      const failedRequest = await this.rewardRequestService.create({
        userId,
        eventId: event.id,
        rewardId: reward.id,
        status: 'FAILED',
        reason: passed.reason ?? '조건을 만족하지 못했습니다.',
        requestedAt: new Date(),
      });
      return failedRequest;
    }

    const pendingRequest = await this.rewardRequestService.create({
      userId,
      eventId: event.id,
      rewardId: reward.id,
      status: 'PENDING',
      requestedAt: new Date(),
    });

    const result = await this.rewardRequestService.markAsSuccess(pendingRequest._id as Types.ObjectId);

    if (!result || result.status === 'FAILED') {
      // 보상 수량 부족 등으로 실패했을 경우 이미 markAsFailed 에서 처리됨
      return result;
    }

    return result;
  }

  async findRewardRequests(filter: { userId?: string; eventId?: string; status?: string }) {
    return this.rewardRequestService.findByFilter(filter);
  }

  async evaluateCondition(
    condition: { type: string; value: any },
    logs: any[],
    friendInviteCount: number,
  ): Promise<{ success: boolean; reason?: string }> {
    const conditionHandlers: Record<string, (value: any) => boolean> = {
      FRIEND_INVITED_COUNT: (value) => friendInviteCount >= value,
      LOGIN_DAY_COUNT: (value) => {
        const uniqueDates = new Set(logs.map(log => new Date(log.timestamp).toDateString()));
        return uniqueDates.size >= value;
      },
    };

    const handler = conditionHandlers[condition.type];
    console.log("condition.type:", condition.type);
    console.log("handler exists?", !!handler);
    console.log("friendInviteCount:", friendInviteCount);
    if (!handler) {
      return { success: false, reason: `Unknown condition type: ${condition.type}` };
    }

    const result = handler(condition.value);
    return result ? { success: true } : { success: false, reason: '조건을 만족하지 못했습니다.' };
  }

  async getUserEventLogs(userId: string) {
    return this.userEventLogService.findByUserId(userId);
  }

  async countFriendInvites(userId: string) {
    return this.userEventLogService.countInvites(userId);
  }
}
