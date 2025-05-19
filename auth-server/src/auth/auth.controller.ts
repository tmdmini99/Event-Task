// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 로그인 요청 처리
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log("test");
    console.log(loginDto);
    const result = await this.authService.login(loginDto);  // await 꼭 붙이기
    console.log('login 결과:', result);
    return result;
  }
  @Post('register')
  async register(@Body() loginDto: LoginDto) {
    console.log('회원가입 요청:', loginDto);
    const result = await this.authService.register(loginDto);
    console.log('register 결과:', result);
    return result;
  }
}
