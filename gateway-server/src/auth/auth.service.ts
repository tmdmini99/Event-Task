import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface'; 
import * as bcrypt from 'bcrypt';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // JWT 토큰 발급 메서드
  // async login(user: { name: string; password: string }) {
  //   log("혹시?");
  //   const payload: JwtPayload = { name: user.name }; // JWT Payload 정보

  //   // JWT 토큰 발급
  //   const accessToken = this.jwtService.sign(payload);

  //   return {
  //     accessToken,
  //   };
  // }

  // 사용자 검증 메서드 (이 예시는 비밀번호 검증을 위한 코드)
  async validateUser(username: string, password: string): Promise<any> {
    // 예시로 사용할 유저 데이터 (실제로는 DB에서 유저를 찾습니다)
    const mockUser = {
      username: 'johnDoe',
      password: '$2b$10$z5TcMChfW8Je3GG3Hkm9D.O9dqv9SExch1sPtd/VLWyzyANXKz8AO', // bcrypt로 암호화된 비밀번호
    };

    if (mockUser.username === username && await bcrypt.compare(password, mockUser.password)) {
      return mockUser;
    }
    return null; // 사용자 검증 실패
  }
}
