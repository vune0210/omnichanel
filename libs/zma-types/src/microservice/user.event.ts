import { IsNotEmpty, IsString } from 'class-validator';

export class UserServiceUserCreatedEventKafkaInput {
  @IsNotEmpty()
  @IsString()
  requestId!: string;

  @IsNotEmpty()
  @IsString()
  tenantId!: string;

  @IsNotEmpty()
  @IsString()
  userId!: string;
}
