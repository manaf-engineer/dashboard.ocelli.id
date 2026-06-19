import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInsectDto {
  @IsNotEmpty()
  @IsString()
  scientific_name: string;

  @IsNotEmpty()
  @IsString()
  common_name: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['Hama', 'Predator', 'Parasitoid', 'Serangga Netral'], {
    message: 'role must be Hama, Predator, Parasitoid or Serangga Netral',
  })
  role: string;

  @IsNotEmpty()
  @IsString()
  family: string;

  @IsNotEmpty()
  @IsString()
  order: string;

  @IsOptional()
  @IsString()
  description?: string;
}
