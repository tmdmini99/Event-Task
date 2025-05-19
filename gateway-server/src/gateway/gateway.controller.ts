import {
  Controller,
  All,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProxyService } from './proxy/proxy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Request as ReqType, Response } from 'express';

@Controller()
export class GatewayController {
  constructor(private readonly proxyService: ProxyService) {}

  // 인증 → 인증 없이 Auth Server로 프록시
  @All('auth/login')
  async handleAuthRequests(@Req() req: ReqType, @Res() res: Response) {
    const result = await this.proxyService.forwardRequest(
      req.method,
      `http://auth-server:3001${req.url}`,
      req.body,
      req.headers,
    );
    res.status(result.status).json(result.data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @All('auth/register')
  async handleRegister(@Request() req, @Res() res: Response) {
    const result = await this.proxyService.forwardRequest(
      req.method,
      `http://auth-server:3001${req.url}`,
      req.body,
      req.headers,
    );
    res.status(result.status).json(result.data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  @Post('events/rewards')
  async handleRewardCreate(@Request() req, @Res() res: Response) {
    const result = await this.proxyService.forwardRequest(
      req.method,
      `http://event-server:3002${req.url}`,
      req.body,
      req.headers,
    );
    res.status(result.status).json(result.data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('events/rewards')
  async handleRewardList(@Req() req: ReqType, @Res() res: Response) {
    const result = await this.proxyService.forwardRequest(
      req.method,
      `http://event-server:3002${req.url}`,
      req.body,
      req.headers,
    );
    res.status(result.status).json(result.data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @All('events/rewards/request')
  async handleRewardRequest(@Request() req, @Res() res: Response) {
    const result = await this.proxyService.forwardRequest(
      req.method,
      `http://event-server:3002${req.url}`,
      req.body,
      req.headers,
    );
    res.status(result.status).json(result.data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @All('events/rewards/request')
  async handleRewardRequestQuery(@Request() req, @Res() res: Response) {
    const result = await this.proxyService.forwardRequest(
      req.method,
      `http://event-server:3002${req.url}`,
      req.body,
      req.headers,
    );
    res.status(result.status).json(result.data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('AUDITOR', 'ADMIN')
  @All('history/*')
  async handleHistoryRequests(@Request() req, @Res() res: Response) {
    const result = await this.proxyService.forwardRequest(
      req.method,
      `http://event-server:3002${req.url}`,
      req.body,
      req.headers,
    );
    res.status(result.status).json(result.data);
  }

  @UseGuards(JwtAuthGuard)
  @All('events/:id')
  async handleEventDetail(@Req() req: ReqType, @Res() res: Response) {
    const result = await this.proxyService.forwardRequest(
      req.method,
      `http://event-server:3002${req.url}`,
      req.body,
      req.headers,
    );
    res.status(result.status).json(result.data);
  }

  @UseGuards(JwtAuthGuard)
  @All('events')
  async handleEventList(@Req() req: ReqType, @Res() res: Response) {
    const result = await this.proxyService.forwardRequest(
      req.method,
      `http://event-server:3002${req.url}`,
      req.body,
      req.headers,
    );
    res.status(result.status).json(result.data);
  }

  @All('*')
  handleUnknown(@Res() res: Response) {
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }
}
