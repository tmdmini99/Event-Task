import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';  // AuthModule을 직접 임포트
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],  // AuthModule만 임포트
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return accessToken when login is successful', async () => {
    const result = await service.login({ name: 'johnDoe', password: 'password' });
    expect(result).toHaveProperty('accessToken');
  });
});
