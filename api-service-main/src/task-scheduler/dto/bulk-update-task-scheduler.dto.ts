import { UpdateTaskSchedulerDto } from './update-task-scheduler.dto';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

export class BulkUpdateTaskSchedulerDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateTaskSchedulerDto)
  tasks: UpdateTaskSchedulerDto[];
}
