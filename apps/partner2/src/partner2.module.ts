import { Module } from '@nestjs/common';

import { AuthModule } from '@app/core';
import { PrismaModule } from '@app/core/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from 'apps/partner1/src/token/token.module';
import { EventsModule } from './events/events.module';
import { SpotsModule } from './spots/spots.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.partner2' }),
    PrismaModule,
    EventsModule,
    SpotsModule,
    TokenModule,
    AuthModule,
  ],
})
export class Partner2Module {}
