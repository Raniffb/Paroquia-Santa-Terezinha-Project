import { IsDateString, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'Festa Junina Paroquial 2026' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: '2026-06-27' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '17h00' })
  @IsString()
  time: string;

  @ApiProperty({ example: 'Pátio da Igreja' })
  @IsString()
  @MinLength(3)
  location: string;

  @ApiProperty({ example: 'Animação ao vivo, comidas típicas e quadrilha.' })
  @IsString()
  @MinLength(5)
  description: string;
}
