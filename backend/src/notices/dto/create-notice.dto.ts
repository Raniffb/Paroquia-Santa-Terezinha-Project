import { IsDateString, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateNoticeDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsDateString()
  date: string;

  @IsString()
  @MinLength(5)
  description: string;

  @IsOptional()
  @IsIn(['normal', 'urgent', 'low'])
  priority?: string;
}
