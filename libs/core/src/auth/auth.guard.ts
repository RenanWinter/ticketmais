import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from './token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['x-api-token'] as string;
    if (!token) {
      return false;
    }

    const isValid = await this.tokenService.isValid(token);
    if (!isValid) {
      return false;
    }

    return true;
  }
}
