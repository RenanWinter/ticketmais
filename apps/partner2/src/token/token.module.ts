import { AuthModule } from '@app/core';
import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';

@Module({
  imports: [AuthModule],
  controllers: [TokenController],
})
export class TokenModule {}
