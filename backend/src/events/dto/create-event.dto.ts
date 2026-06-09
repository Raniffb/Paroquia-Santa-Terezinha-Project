import { IsBoolean, IsDateString, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const CATEGORIAS = ['missa', 'encontro', 'retiro', 'festivo', 'formacao', 'social'];

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

  @ApiPropertyOptional({ example: 'encontro', enum: CATEGORIAS })
  @IsOptional()
  @IsIn(CATEGORIAS)
  category?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
