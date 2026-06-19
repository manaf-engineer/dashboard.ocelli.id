import { Transform } from 'class-transformer';
import { formatDateInTimezone } from '../../common/utils/date-to-string';

export class RoleResponseDto {
  id: number;
  name: string;
  label: string;
  description: string;
  created_by: number;
  @Transform(({ value }) => formatDateInTimezone(value))
  created_at: string;
  updated_by: number;
  @Transform(({ value }) => formatDateInTimezone(value))
  updated_at: string;
}
