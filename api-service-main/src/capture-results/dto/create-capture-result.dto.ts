import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsInt,
  IsDate,
} from 'class-validator';

export class CreateCaptureResultDto {
  @IsOptional()
  @IsString()
  image?: string;

  @IsNotEmpty()
  @IsDate()
  collection_time: Date;

  @IsNotEmpty()
  @IsInt()
  trap_node_id: number;

  @IsOptional()
  @IsInt()
  created_by?: number;
}
