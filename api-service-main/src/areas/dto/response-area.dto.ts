import { Transform } from 'class-transformer';
import { formatDateInTimezone } from '../../common/utils/date-to-string';

export class AreaResponseDto {
  id: number;

  area_id: string;

  name: string;

  province: string;

  regency: string;

  subdistrict: string;

  created_by?: number;

  @Transform(({ value }) => formatDateInTimezone(value))
  created_at: Date;

  updated_by?: number;

  @Transform(({ value }) => formatDateInTimezone(value))
  updated_at?: Date;

  constructor(partial: Partial<AreaResponseDto>) {
    Object.assign(this, partial);
  }
}
