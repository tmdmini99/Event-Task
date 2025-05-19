// gateway/auth/roles.guard.ts
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { log } from 'console';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('RolesGuard - required roles:', roles);
    console.log('RolesGuard - user role:', user?.role);
    if (!roles.includes(user.role)) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    return true;
  }
}

