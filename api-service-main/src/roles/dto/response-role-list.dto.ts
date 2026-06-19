import { Transform } from 'class-transformer';
import { formatDateInTimezone } from '../../common/utils/date-to-string';
import { UserResponseDto } from '../../users/dtos/response-user.dto';

export class RoleListResponseDto {
  id: number;
  name: string;
  label: string;
  description: string;
  user_count: number;
  users: UserResponseDto[];
  created_by: number;
  @Transform(({ value }) => formatDateInTimezone(value))
  created_at: string;
  updated_by: number;
  @Transform(({ value }) => formatDateInTimezone(value))
  updated_at: string;
}
