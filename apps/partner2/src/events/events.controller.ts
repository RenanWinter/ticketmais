import { EventsService } from '@app/core';
import { AuthGuard } from '@app/core/auth/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateEventRequest } from './request/create-event.request';
import { UpdateEventRequest } from './request/update-event.request';

@UseGuards(AuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() request: CreateEventRequest) {
    return this.eventsService.create(request);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':eventId')
  findOne(@Param('eventId') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':eventId')
  update(@Param('eventId') id: string, @Body() request: UpdateEventRequest) {
    return this.eventsService.update(id, request);
  }

  @HttpCode(204)
  @Delete(':eventId')
  remove(@Param('eventId') id: string) {
    return this.eventsService.remove(id);
  }
}
