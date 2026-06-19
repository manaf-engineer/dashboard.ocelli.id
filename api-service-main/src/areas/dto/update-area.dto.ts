import { IsOptional, IsString } from 'class-validator';

export class UpdateAreaDto {
  @IsOptional()
  @IsString()
  area_id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  regency?: string;

  @IsOptional()
  @IsString()
  subdistrict?: string;

  @IsOptional()
  updated_by?: number;
}
