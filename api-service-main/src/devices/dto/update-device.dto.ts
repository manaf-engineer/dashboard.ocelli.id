import { IsOptional, IsString } from 'class-validator';

export class UpdateDeviceDto {
  @IsString()
  @IsOptional()
  readonly trap_id?: string;
}
