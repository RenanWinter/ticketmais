import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { TokenExpired } from './exceptions/token-expired';
import { TokenNotFound } from './exceptions/token-not-found';

@Injectable()
export class TokenService {
  constructor(private prismaService: PrismaService) {}

  create(createTokenDto: CreateTokenDto) {
    return this.prismaService.apiToken.create({
      data: {
        ...createTokenDto,
      },
    });
  }

  findOne(id: string) {
    return this.prismaService.apiToken.findFirst({
      where: { id },
    });
  }

  remove(id: string) {
    return this.prismaService.apiToken.delete({
      where: { id },
    });
  }

  async isValid(id: string) {
    const token = await this.findOne(id);
    if (!token) {
      throw new TokenNotFound();
    }

    const validity = new Date(token.validity);
    const now = new Date();
    if (now > validity) {
      throw new TokenExpired();
    }

    return token;
  }
}
