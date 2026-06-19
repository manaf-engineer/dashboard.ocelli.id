import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { IsMatch } from '../../common/validators/is-match';

export class ResetPasswordInputDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @IsMatch('password')
  repeat_password: string;
}
