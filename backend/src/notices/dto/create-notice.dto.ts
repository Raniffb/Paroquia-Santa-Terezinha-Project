import { IsDateString, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNoticeDto {
  @ApiProperty({ example: 'Campanha do Agasalho 2026' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: '2026-06-01' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Arrecadação de roupas até 30 de junho.' })
  @IsString()
  @MinLength(5)
  description: string;

  @ApiPropertyOptional({ example: 'normal', enum: ['normal', 'urgent', 'low'] })
  @IsOptional()
  @IsIn(['normal', 'urgent', 'low'])
  priority?: string;
}
