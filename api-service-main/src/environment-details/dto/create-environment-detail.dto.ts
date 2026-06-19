import {
  IsOptional,
  IsNumber,
  IsInt,
  IsNotEmpty,
  IsDate,
} from 'class-validator';

export class CreateEnvironmentDetailDto {
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

  @IsNotEmpty()
  @IsInt()
  trap_node_id: number;

  @IsNotEmpty()
  @IsDate()
  collection_time: Date;

  @IsOptional()
  @IsInt()
  created_by?: number;
}
