// dto/create-user-event-log.dto.ts
export class UserEventLogDto {
  userId: string;
  eventId: string;
  rewardId: string;
  action: string;
  timestamp?: Date; // 기본값은 service에서 넣어도 됨
}
