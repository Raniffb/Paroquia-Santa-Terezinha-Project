import { IsBoolean, IsDateString, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty({ example: 'Missa Solene de Santa Teresinha' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: '2026-10-01' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Resumo da notícia em até 2 linhas.' })
  @IsString()
  @MinLength(10)
  summary: string;

  @ApiProperty({ example: 'Texto completo da notícia...' })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiPropertyOptional({ example: 'https://exemplo.com/imagem.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
