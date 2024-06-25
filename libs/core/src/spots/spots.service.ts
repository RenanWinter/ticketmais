import { Injectable } from '@nestjs/common';
import { Prisma, SpotStatus, TicketStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpotDto } from './dto/create-spot.dto';
import { ReserveSpotDto } from './dto/reserve-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { SpotsNotFoundError } from './exceptions/spots-not-found-error';
import { UnavailableSpotError } from './exceptions/unavailable-spot-error';

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

  async reserveSpot(eventId: string, dto: ReserveSpotDto) {
    const spotNames = dto.spots.map((spot) => spot.spot);
    const spots = await this.prismaService.spot.findMany({
      where: {
        eventId,
        name: { in: spotNames },
      },
    });

    if (spots.length !== spotNames.length) {
      const foundSpotsName = spots.map((spot) => spot.name);
      const notFoundSpots = spotNames.filter(
        (spotName) => !foundSpotsName.includes(spotName),
      );
      throw new SpotsNotFoundError(notFoundSpots);
    }

    try {
      const tickets = await this.prismaService.$transaction(
        async (prisma) => {
          await prisma.reservationHistory.createMany({
            data: spots.map((spot) => {
              const reserve = dto.spots.find((s) => s.spot === spot.name);
              const data = {
                spotId: spot.id,
                ticketKind: reserve.kind,
                email: dto.email,
                status: TicketStatus.reserved,
              };

              return data;
            }),
          });

          await prisma.spot.updateMany({
            data: { status: TicketStatus.reserved },
            where: { id: { in: spots.map((spot) => spot.id) } },
          });

          const tickets = await Promise.all(
            spots.map((spot) => {
              const reserve = dto.spots.find((s) => s.spot === spot.name);
              return prisma.ticket.create({
                data: {
                  spotId: spot.id,
                  email: dto.email,
                  ticketKind: reserve.kind,
                },
              });
            }),
          );

          return tickets;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
      );

      return tickets;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
          case 'P2002': // unique constraint violation
          case 'P2034': // transaction conflict
            throw new UnavailableSpotError();
        }
      }
      throw e;
    }
  }

  availableSpots(eventId: string) {
    return this.prismaService.spot.findMany({
      where: {
        eventId,
        status: SpotStatus.available,
      },
    });
  }
}
