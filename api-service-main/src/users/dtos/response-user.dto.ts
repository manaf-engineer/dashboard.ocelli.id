import { Exclude, plainToInstance, Transform } from 'class-transformer';
import { formatDateInTimezone } from '../../common/utils/date-to-string';
import { RoleResponseDto } from '../../roles/dto/response-role.dto';
import { transformImageToPublicUrl } from '../../common/utils/file-to-public-url';

export class UserResponseDto {
  id: number;
  name: string;
  @Exclude()
  username: string;
  email: string;
  @Transform(({ value }) => transformImageToPublicUrl(value))
  photo: string;
  @Exclude()
  password: string;
  @Exclude()
  password_reset_token: string;
  @Exclude()
  password_reset_at: string;
  status?: boolean;
  created_by: number;
  @Transform(({ value }) => formatDateInTimezone(value))
  created_at: string;
  updated_by: number;
  @Transform(({ value }) => formatDateInTimezone(value))
  updated_at: string;
  @Transform(({ value }) => plainToInstance(RoleResponseDto, value))
  role: RoleResponseDto;
}
