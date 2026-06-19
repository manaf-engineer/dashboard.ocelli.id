import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { IsUnique } from '../../common/validators/is-unique';
import { IsExist } from '../../common/validators/is-exist';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsUnique({ tableName: 'users', column: 'email' })
  email: string;

  @IsNotEmpty()
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
  @IsBoolean()
  status?: boolean = true;

  @IsNotEmpty()
  @IsNumber()
  @IsExist({ tableName: 'roles', column: 'id' })
  role_id: number;
}
