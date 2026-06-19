import { Transform } from 'class-transformer';
import { formatDateInTimezone } from '../../common/utils/date-to-string';

export class ResponseTaskSchedulerDto {
  id: number;
  name: string;
  type: string;
  expression: string;

  @Transform(({ value }) => formatDateInTimezone(value))
  created_at: Date;
  updated_by?: number;

  @Transform(({ value }) => formatDateInTimezone(value))
  updated_at?: Date;
}
