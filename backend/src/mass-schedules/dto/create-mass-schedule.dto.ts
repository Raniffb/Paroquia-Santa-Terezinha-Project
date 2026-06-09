import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMassScheduleDto {
  @ApiProperty({ example: 'Domingo' })
  @IsString()
  @MinLength(3)
  day: string;

  @ApiProperty({ example: '09h00' })
  @IsString()
  time: string;

  @ApiPropertyOptional({ example: 'Missa com grupo de jovens' })
  @IsOptional()
  @IsString()
  observation?: string;
}
