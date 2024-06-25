import { Injectable } from '@nestjs/common';
import { Prisma, TicketStatus } from '@prisma/client';
import { PrismaService } from './../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ReserveSpotDto } from './dto/reserve-spot.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { SpotsNotFoundError } from './exceptions/spots-not-found-error';
import { UnavailableSpotError } from './exceptions/unavailable-spot-error';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}

  create(createEventDto: CreateEventDto) {
    return this.prismaService.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date),
      },
    });
  }

  findAll() {
    return this.prismaService.event.findMany();
  }

  findOne(id: string) {
    return this.prismaService.event.findUnique({
      where: { id },
    });
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this.prismaService.event.update({
      data: {
        ...updateEventDto,
        date: new Date(updateEventDto.date),
      },
      where: { id },
    });
  }

  remove(id: string) {
    return this.prismaService.event.delete({ where: { id } });
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
}
