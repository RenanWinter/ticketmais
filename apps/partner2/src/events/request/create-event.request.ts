import {
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventRequest {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsOptional()
  description: string;

  @IsISO8601({ strict: true })
  date: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
