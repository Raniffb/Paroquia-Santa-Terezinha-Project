import { IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMassScheduleDto {
  @ApiProperty({ example: 'Domingo' })
  @IsString()
  @MinLength(3)
  day: string;

  @ApiProperty({ example: '07h00,09h00,11h00,18h00', description: 'Horários no formato HHhMM separados por vírgula' })
  @IsString()
  @Matches(/^(\d{2}h\d{2})(,\d{2}h\d{2})*$/, {
    message: 'Horários devem estar no formato HHhMM separados por vírgula. Ex: 07h00,09h00,18h00'
  })
  times: string;

  @ApiPropertyOptional({ example: 'Missa com grupo de jovens' })
  @IsOptional()
  @IsString()
  observation?: string;
}
