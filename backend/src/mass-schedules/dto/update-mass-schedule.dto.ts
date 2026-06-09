import { PartialType } from '@nestjs/mapped-types';
import { CreateMassScheduleDto } from './create-mass-schedule.dto';

export class UpdateMassScheduleDto extends PartialType(CreateMassScheduleDto) {}
