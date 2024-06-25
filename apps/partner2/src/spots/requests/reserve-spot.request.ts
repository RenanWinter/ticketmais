import { TicketKind } from '@prisma/client';
import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ReserveSpotRequest {
  @IsNotEmpty()
  @IsArray()
  spots: Array<{ spot: string; kind: TicketKind }>;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
