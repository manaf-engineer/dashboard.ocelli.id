import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgetPasswordInputDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
