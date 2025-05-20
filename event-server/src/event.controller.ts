import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { EventService } from './event.service';
import { EventDto, EventStatus } from './event/dto/event.dto';
import { RewardDto } from './reward/dto/reward.dto';
import { RewardRequestDto } from './reward-request/dto/reward-request.dto';

import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  @Post()
  async createEvent(@Body() dto: EventDto) {
    return this.eventService.createEvent(dto);
  }

  @Get()
  async getEvents(@Query('status') status?: EventStatus) {
    return this.eventService.findEvents(status);
  }

  

  @Get('rewards')
  async getRewards(@Query('eventId') eventId?: string) {
    return this.eventService.findRewards(eventId);
  }

  @UseGuards(RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  @Post('rewards')
  async createReward(@Body() dto: RewardDto) {
    return this.eventService.createReward(dto);
  }

  @Post('rewards/request')
  async requestReward(@Body() dto: RewardRequestDto, @Req() req: Request) {
    console.log('req.user:', req.user);
    const currentUser = req.user as { userId: string }; 
    return this.eventService.requestReward({ ...dto, userId: currentUser.userId });
  }

  @Get('rewards/request')
  async getRewardRequests(
    @Req() req: Request,
    @Query('eventId') eventId?: string,
    @Query('status') status?: string,
  ) {
    const currentUser = req.user as { role: string; userId: string };
    const filter: any = { eventId, status };

    if (currentUser.role === 'USER') {
      filter.userId = currentUser.userId;
    }

    return this.eventService.findRewardRequests(filter);
  }

  @Get(':id')
  async getEventById(@Param('id') id: string) {
    return this.eventService.findEventById(id);
  }
}
