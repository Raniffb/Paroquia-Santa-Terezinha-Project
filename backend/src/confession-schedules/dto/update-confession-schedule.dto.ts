import { PartialType } from '@nestjs/mapped-types';
import { CreateConfessionScheduleDto } from './create-confession-schedule.dto';

export class UpdateConfessionScheduleDto extends PartialType(CreateConfessionScheduleDto) {}
