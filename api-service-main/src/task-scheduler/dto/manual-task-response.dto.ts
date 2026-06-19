import { formatDateInTimezone } from '../../common/utils/date-to-string';
import { plainToInstance, Transform } from 'class-transformer';
import { Area } from '../../database/entities/area.entity';
import { AreaResponseDto } from '../../areas/dto/response-area.dto';

export class ManualTaskResponseDto {
  id: number;
  trap_id: string;
  type: string;
  status: boolean;
  created_by?: number;

  @Transform(({ value }) => formatDateInTimezone(value))
  created_at: string;
  updated_by?: number;

  @Transform(({ value }) => formatDateInTimezone(value))
  updated_at?: string;
}
