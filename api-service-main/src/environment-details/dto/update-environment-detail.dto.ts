import { IsOptional, IsNumber, IsInt, IsDate } from 'class-validator';

export class UpdateEnvironmentDetailDto {
  @IsOptional()
  @IsNumber()
  wind_speed?: number;

  @IsOptional()
  @IsNumber()
  light_intensity?: number;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsNumber()
  humidity?: number;

  @IsOptional()
  @IsInt()
  trap_node_id?: number;

  @IsOptional()
  @IsDate()
  collection_time?: Date;

  @IsOptional()
  @IsInt()
  updated_by?: number;
}
