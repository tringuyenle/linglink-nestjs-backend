import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDTO,
  LogInDTO,
  RefreshTokenInput,
  ResetPasswordDTO,
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDTO) {
    return this.authService.register(body);
  }

  @Post('login')
  // @Version('2')
  login(@Body() body: LogInDTO) {
    return this.authService.login(body);
  }

  @Post('requestPasswordReset')
  async requestPasswordReset(@Body() body: { email: string }) {
    return this.authService.requestPasswordReset(body);
  }

  @Post('resetPassword')
  async resetPassword(@Body() body: ResetPasswordDTO) {
    return this.authService.resetPassword(
      body.userId,
      body.token,
      body.password,
    );
  }

  @Post('refreshToken')
  async refreshToken(@Body() { token }: RefreshTokenInput) {
    return this.authService.refreshToken(token);
  }
}
