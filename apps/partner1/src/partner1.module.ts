import { AuthModule } from '@app/core';
import { PrismaModule } from '@app/core/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { SpotsModule } from './spots/spots.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.partner1', isGlobal: true }),
    PrismaModule,
    EventsModule,
    SpotsModule,
    TokenModule,
    AuthModule,
  ],
})
export class Partner1Module {}
