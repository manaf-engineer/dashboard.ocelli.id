import { Transform } from 'class-transformer';
import { formatDateInTimezone } from '../../common/utils/date-to-string';

export class EnvironmentDetailResponseDto {
  id: number;

  wind_speed?: number;

  light_intensity?: number;

  temperature?: number;

  humidity?: number;

  trap_node_id: number;

  @Transform(({ value }) => formatDateInTimezone(value))
  collection_time: Date;

  created_by?: number;

  @Transform(({ value }) => formatDateInTimezone(value))
  created_at: Date;

  @Transform(({ value }) => formatDateInTimezone(value))
  updated_at?: Date;

  updated_by?: number;
}
