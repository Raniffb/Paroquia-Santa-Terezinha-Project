import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHorariosInfoDto {
  @ApiProperty({ example: 'Horários especiais' })
  @IsString()
  @MinLength(2)
  title: string;

  @ApiProperty({ example: 'Em datas festivas podem ser celebradas missas adicionais.' })
  @IsString()
  @MinLength(5)
  description: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
