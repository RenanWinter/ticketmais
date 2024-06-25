import { TicketKind } from '@prisma/client';

export class ReserveSpotDto {
  spots: Array<{ spot: string; kind: TicketKind }>;
  email: string;
}
