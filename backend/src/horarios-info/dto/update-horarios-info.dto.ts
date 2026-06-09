import { PartialType } from '@nestjs/mapped-types';
import { CreateHorariosInfoDto } from './create-horarios-info.dto';

export class UpdateHorariosInfoDto extends PartialType(CreateHorariosInfoDto) {}
