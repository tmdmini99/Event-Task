// src/auth/dto/login.dto.ts
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsString()
  role?: string;
}
