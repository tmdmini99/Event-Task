// src/event/dto/event.dto.ts

import {
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsNotEmpty,
  IsObject,
  IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum EventStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

class ConditionDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsDefined()
  value: any;
}

export class EventDto {
  @IsString()
  title: string;

  @ValidateNested()
  @Type(() => ConditionDto)
  @IsObject()
  condition: ConditionDto;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(EventStatus)
  status: EventStatus;
}
