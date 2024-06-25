import { AuthGuard } from '@app/core';
import { SpotsService } from '@app/core/spots/spots.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateSpotRequest } from './requests/create-spot.request';
import { ReserveSpotRequest } from './requests/reserve-spot.request';
import { UpdateSpotRequest } from './requests/update-spot.request';

UseGuards(AuthGuard);
@Controller('events/:eventId/spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post('reserve')
  reserveSpots(
    @Param('eventId') eventId: string,
    @Body() request: ReserveSpotRequest,
  ) {
    return this.spotsService.reserveSpot(eventId, request);
  }

  @Post()
  create(
    @Body() request: CreateSpotRequest,
    @Param('eventId') eventId: string,
  ) {
    return this.spotsService.create({ ...request, eventId });
  }

  @Get()
  findAll(@Param('eventId') eventId: string) {
    return this.spotsService.findAll(eventId);
  }

  @Get('available')
  availableSpots(@Param('eventId') eventId: string) {
    return this.spotsService.availableSpots(eventId);
  }

  @Get(':spotId')
  findOne(@Param('eventId') eventId: string, @Param('spotId') id: string) {
    return this.spotsService.findOne(eventId, id);
  }

  @Patch(':spotId')
  update(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @Body() request: UpdateSpotRequest,
  ) {
    return this.spotsService.update(eventId, id, request);
  }

  @Delete(':spotId')
  remove(@Param('eventId') eventId: string, @Param('spotId') id: string) {
    return this.spotsService.remove(eventId, id);
  }
}
