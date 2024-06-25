import { IsEmail, IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  user: string;

  @IsISO8601({ strict: true })
  validity: string;
}
