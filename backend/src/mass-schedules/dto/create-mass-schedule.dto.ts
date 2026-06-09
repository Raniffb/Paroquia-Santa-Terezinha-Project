import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMassScheduleDto {
  @ApiProperty({ example: 'Domingo' })
  @IsString()
  @MinLength(3)
  day: string;

  @ApiProperty({ example: '07h00,09h00,11h00,18h00', description: 'Horários separados por vírgula' })
  @IsString()
  times: string;

  @ApiPropertyOptional({ example: 'Missa com grupo de jovens' })
  @IsOptional()
  @IsString()
  observation?: string;
}
