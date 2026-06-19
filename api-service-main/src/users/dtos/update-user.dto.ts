import {
  IsEmail,
  IsOptional,
  IsString,
  IsAlphanumeric,
  MinLength,
  IsBoolean,
  IsNumber,
  IsNotEmpty, IsStrongPassword
} from "class-validator";
import { IsExist } from '../../common/validators/is-exist';
import { IsBase64Image } from '../../common/validators/is-base64';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @IsOptional()
  @IsAlphanumeric()
  @MinLength(3)
  username: string;

  @IsOptional()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsBase64Image({ message: 'photo must be valid base64 image' })
  photo: string;

  @IsOptional()
  @IsNumber()
  @IsExist({ tableName: 'roles', column: 'id' })
  role_id: number;

  @IsOptional()
  @IsBoolean()
  status: boolean;
}
