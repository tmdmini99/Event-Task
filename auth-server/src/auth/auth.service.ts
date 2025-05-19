import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { log } from 'console';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    console.log('로그인 요청 도착:', loginDto);
    const user = await this.usersService.findByUsername(loginDto.name);
    log("user : ", user);
    const hashedPassword = await bcrypt.hash(loginDto.password, 10);
    console.log('입력한 비밀번호 해시:', hashedPassword);
    if (!user) {
      console.log('사용자 없음');
      return { message: '로그인 실패: 사용자 없음' };
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      console.log('비밀번호 불일치');
      return { message: '로그인 실패: 비밀번호 불일치' };
    }

    const payload = {
      name: user.name,
      sub: user._id,
      role: user.role || 'USER',
    };
    const expiresIn = Number(this.configService.get<string>('JWT_EXPIRATION_TIME')) || 3600;
    const accessToken = this.jwtService.sign(payload, { expiresIn });
    console.log('ex!!!!!! : ', expiresIn);
    console.log('토큰 발급 성공2222222:', accessToken);
    return { accessToken };
  }

  async register(loginDto: LoginDto) {
    console.log('회원가입 서비스 호출:', loginDto);

    // 이미 존재하는 사용자명 체크
    const existingUser = await this.usersService.findByUsername(loginDto.name);
    log("existing : ", existingUser);
    if (existingUser) {
      return { message: '회원가입 실패: 이미 존재하는 사용자입니다.' };
    }
    log("여기");
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(loginDto.password, 10);

    // 사용자 생성
    const createdUser = await this.usersService.createUser({
      name: loginDto.name,
      password: hashedPassword,
      role: loginDto.role || 'USER',
    });

    return { message: '회원가입 성공', userId: createdUser._id };
  }
}
