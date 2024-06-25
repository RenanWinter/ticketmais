import { TokenService } from '@app/core';
import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';

@Controller('tokens')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  create(@Body() createTokenDto: CreateTokenDto) {
    return this.tokenService.create(createTokenDto);
  }

  // @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tokenService.remove(id);
  }
}
