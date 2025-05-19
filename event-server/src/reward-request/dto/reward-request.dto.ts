// dto/create-reward-request.dto.ts
export class RewardRequestDto {
  userId: string;
  eventId: string;
  rewardId: string;
  status?: 'PENDING' | 'SUCCESS' | 'FAILED'; // 기본값은 'PENDING'
  requestedAt?: Date; // 기본값은 service에서 처리
}
