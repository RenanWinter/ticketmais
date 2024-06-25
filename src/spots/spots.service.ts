import { Injectable } from '@nestjs/common';
import { SpotStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';

type CreateSpotInput = CreateSpotDto & { eventId: string };

@Injectable()
export class SpotsService {
  constructor(private prismaService: PrismaService) {}

  async create(createSpotInput: CreateSpotInput) {
    const event = await this.prismaService.event.findFirst({
      where: { id: createSpotInput.eventId },
    });

    if (!event) {
      throw new Error('Event not found');
    }
    return this.prismaService.spot.create({
      data: {
        ...createSpotInput,
        status: SpotStatus.available,
      },
    });
  }

  findAll(eventId: string) {
    return this.prismaService.spot.findMany({
      where: { eventId },
    });
  }

  findOne(eventId: string, spotId: string) {
    return this.prismaService.spot.findFirst({
      where: { eventId, id: spotId },
    });
  }

  update(eventId: string, spotId: string, updateSpotDto: UpdateSpotDto) {
    return this.prismaService.spot.update({
      data: updateSpotDto,
      where: { eventId, id: spotId },
    });
  }

  remove(eventId: string, spotId: string) {
    return this.prismaService.spot.delete({
      where: { eventId, id: spotId },
    });
  }
}
