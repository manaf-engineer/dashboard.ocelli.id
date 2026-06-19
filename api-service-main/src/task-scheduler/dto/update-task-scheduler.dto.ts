import { IsNotEmpty, IsOptional, IsInt, Min, Max } from 'class-validator';

export class UpdateTaskSchedulerDto {
  @IsNotEmpty()
  id: number;

  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(1440)
  interval: number;
}
