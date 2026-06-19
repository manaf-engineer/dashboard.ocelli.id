import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateInsectDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  scientific_name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  common_name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsIn(['Hama', 'Predator', 'Parasitoid', 'Serangga Netral'], {
    message: 'role must be Hama, Predator, Parasitoid or Serangga Netral',
  })
  role?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  family?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  order?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  updated_by?: number;
}
