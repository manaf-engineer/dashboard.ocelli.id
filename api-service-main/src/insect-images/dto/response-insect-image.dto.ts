import { Transform } from 'class-transformer';
import { formatDateInTimezone } from '../../common/utils/date-to-string';

export class ResponseInsectImageDto {
  id: number;
  image: string;
  insect_id: number;

  tag?: string;
  created_by?: number;

  @Transform(({ value }) => formatDateInTimezone(value))
  created_at: Date;
  updated_by?: number;

  @Transform(({ value }) => formatDateInTimezone(value))
  updated_at?: Date;
}
