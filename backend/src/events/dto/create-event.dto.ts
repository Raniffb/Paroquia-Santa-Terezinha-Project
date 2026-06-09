import { IsDateString, IsString, MinLength } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @IsString()
  @MinLength(3)
  location: string;

  @IsString()
  @MinLength(5)
  description: string;
}
