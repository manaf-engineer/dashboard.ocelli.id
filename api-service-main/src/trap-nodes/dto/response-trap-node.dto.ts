import { formatDateInTimezone } from '../../common/utils/date-to-string';
import { plainToInstance, Transform } from 'class-transformer';
import { Area } from '../../database/entities/area.entity';
import { AreaResponseDto } from '../../areas/dto/response-area.dto';

export class ResponseTrapNodeDto {
  id: number;
  trap_id: string;
  name: string;
  latitude: string;
  longitude: string;
  status: boolean;
  area_id?: number;

  @Transform(({ value }) => plainToInstance(AreaResponseDto, value))
  area?: Area;
  created_by?: number;

  @Transform(({ value }) => formatDateInTimezone(value))
  created_at: string;
  updated_by?: number;

  @Transform(({ value }) => formatDateInTimezone(value))
  updated_at?: string;

  @Transform(({ value }) => formatDateInTimezone(value))
  last_update: Date;

  environment_details?: any[];
  capture_results?: any[];

  constructor(partial: Partial<ResponseTrapNodeDto>) {
    Object.assign(this, partial);
  }
}
