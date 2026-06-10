import { IsBoolean, IsDateString, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const CATEGORIAS = ['liturgia', 'comunidade', 'administrativo', 'formacao', 'social', 'geral'];

export class CreateNoticeDto {
  @ApiProperty({ example: 'Campanha do Agasalho 2026' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: '2026-06-01' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: 'Breve descrição exibida na listagem de avisos.' })
  @IsOptional()
  @IsString()
  @MaxLength(400)
  summary?: string;

  @ApiProperty({ example: '<p>Arrecadação de roupas até 30 de junho.</p>' })
  @IsString()
  @MinLength(5)
  description: string;

  @ApiPropertyOptional({ example: 'normal', enum: ['normal', 'urgent', 'low'] })
  @IsOptional()
  @IsIn(['normal', 'urgent', 'low'])
  priority?: string;

  @ApiPropertyOptional({ example: 'geral', enum: CATEGORIAS })
  @IsOptional()
  @IsIn(CATEGORIAS)
  category?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
