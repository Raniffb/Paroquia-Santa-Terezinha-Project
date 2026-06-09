import { IsBoolean, IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsDateString()
  date: string;

  @IsString()
  @MinLength(10)
  summary: string;

  @IsString()
  @MinLength(10)
  content: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
