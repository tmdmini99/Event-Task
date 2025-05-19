import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as PassportJwtStrategy } from 'passport-jwt'; // passport-jwt에서 Strategy 클래스를 가져옵니다.
import { ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface'; // JWT Payload 인터페이스
import { UsersService } from '../users/users.service'; // 유저 서비스를 사용하여 유저 검증

import { ConfigService } from '@nestjs/config'; // 환경 변수 사용을 위한 ConfigService

@Injectable()
export class JwtStrategy extends PassportStrategy(PassportJwtStrategy) {
  constructor(
    private readonly usersService: UsersService, // UsersService를 주입받음
    private readonly configService: ConfigService, // ConfigService를 주입받아 환경 변수 사용
  ) {
    const secret = configService.get<string>('JWT_SECRET_KEY') || 'secretKey';
    console.log('[JwtStrategy] Loaded JWT_SECRET_KEY:', secret);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 요청 헤더에서 JWT를 추출
      ignoreExpiration: false, // 토큰 만료 여부를 체크
      secretOrKey: configService.get<string>('JWT_SECRET_KEY') || 'secretKey', // 환경변수에서 JWT_SECRET을 가져옴
    });
  }

  // JWT Payload 검증 메서드
  async validate(payload: JwtPayload) {
    const { name } = payload;
    const user = await this.usersService.findByUsername(name); // 유저 정보 찾기
    console.log("user : ",user);
    if (!user) {
      throw new Error('Unauthorized'); // 유저가 없다면 Unauthorized 오류를 던짐
    }
    return user; // 유저를 반환하여 요청의 req.user에 할당
  }
}
