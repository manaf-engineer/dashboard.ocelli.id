import { Transform } from 'class-transformer';
import { formatDateInTimezone } from '../../common/utils/date-to-string';

export class CaptureResultResponseDto {
  id: number;

  @Transform(({ value }) => formatDateInTimezone(value))
  collection_time: Date;

  trap_node_id: number;

  created_by?: number;

  @Transform(({ value }) => formatDateInTimezone(value))
  created_at: Date;

  @Transform(({ value }) => formatDateInTimezone(value))
  updated_at?: Date;

  updated_by?: number;

  image?: string;
}
