import {
  Controller,
  Post,
  Body,
  Headers,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgetPasswordInputDto } from './dto/forget-password-input.dto';
import { ResetPasswordInputDto } from './dto/reset-password-input.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async loginUser(
    @Body() { username, password }: { username: string; password: string },
  ) {
    return this.authService.login(username, password);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Headers('authorization') authorization?: string) {
    return await this.authService.logOut(authorization);
  }

  @Post('forget-password')
  @HttpCode(HttpStatus.OK)
  async forgetPassword(
    @Body() forgetPasswordInput: ForgetPasswordInputDto,
  ): Promise<any> {
    return await this.authService.forgetPassword(forgetPasswordInput.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordInput: ResetPasswordInputDto,
  ): Promise<any> {
    return await this.authService.resetPassword(resetPasswordInput);
  }
}
