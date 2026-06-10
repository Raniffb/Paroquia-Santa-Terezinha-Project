import { IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConfessionScheduleDto {
  @ApiProperty({ example: 'Sábado' })
  @IsString()
  @MinLength(3)
  day: string;

  @ApiProperty({ example: '08h00 às 08h45' })
  @IsString()
  @MinLength(3)
  @Matches(/^(?:(?!\d{2}:\d{2}).)*$/, {
    message: 'Use o formato HHhMM para os horários. Ex: 08h00 às 08h45'
  })
  schedule: string;
}
