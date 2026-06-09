import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMassScheduleDto {
  @IsString()
  @MinLength(3)
  day: string;

  @IsString()
  time: string;

  @IsOptional()
  @IsString()
  observation?: string;
}
