import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSacramentoDto {
  @ApiProperty({ example: 'Batismo' })
  @IsString()
  @MinLength(2)
  title: string;

  @ApiProperty({ example: 'Celebrado aos domingos, às 12h30.' })
  @IsString()
  @MinLength(5)
  description: string;

  @ApiPropertyOptional({ example: 'pi-drop' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
