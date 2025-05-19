import { Test, TestingModule } from '@nestjs/testing';
import { GatewayController } from './gateway.controller';
import { ProxyService } from './proxy/proxy.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import * as request from 'supertest';
import * as express from 'express';
import { join } from 'path';

describe('GatewayController Integration Test (Real Auth Server)', () => {
  let app;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: join(__dirname, '..', '..', '..', '.env'),
          isGlobal: true,
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [GatewayController],
      providers: [
        ProxyService,
        JwtStrategy,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(express.json());
    await app.init();
  });

  it('/auth/login 실제 Auth 서버 요청으로 토큰 받기', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ name: 'Jane Doe', password: 'password' });

    expect(loginResponse.status).toBeLessThan(400);
    expect(loginResponse.body).toHaveProperty('accessToken');

    accessToken = loginResponse.body.accessToken;
  });

  it('/auth/register 받은 토큰으로 회원가입 시도', async () => {
    if (!accessToken) throw new Error('로그인 토큰 없음');
    console.log(`${accessToken} accessToken!!!!!!!!!!!!!!!!!!`);
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'newuser',
        password: '123456',
        role: 'USER',
      });

    expect(registerResponse.status).toBeLessThan(500);
    expect(registerResponse.body).toHaveProperty('message');
  });

  afterAll(async () => {
    await app.close();
  });
});
