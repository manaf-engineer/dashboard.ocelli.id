import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAreaDto {
  @IsNotEmpty()
  @IsString()
  area_id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  province: string;

  @IsNotEmpty()
  @IsString()
  regency: string;

  @IsNotEmpty()
  @IsString()
  subdistrict: string;

  @IsOptional()
  created_by?: number;
}
