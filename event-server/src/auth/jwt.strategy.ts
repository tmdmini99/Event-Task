import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    console.log('All env variables:', process.env);
    const secret = configService.get<string>('JWT_SECRET_KEY') ?? 'defaultSecret';
    console.log('JWT_SECRET in JwtStrategy:', secret);
    console.log('Current Date (UTC):', new Date().toISOString());
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    console.log('JWT payload:', payload);
    return { userId: payload.sub, role: payload.role };
  }
}
