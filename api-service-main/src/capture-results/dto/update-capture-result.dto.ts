import { IsOptional, IsString, IsInt, IsDate } from 'class-validator';

export class UpdateCaptureResultDto {
  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsDate()
  collection_time?: Date;

  @IsOptional()
  @IsInt()
  trap_node_id?: number;

  @IsOptional()
  @IsInt()
  updated_by?: number;
}
