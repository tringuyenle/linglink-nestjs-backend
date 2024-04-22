import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { GoogleAuthGuard } from '../guard/google.guard';

@Controller('auth/google')
export class GoogleController {
  constructor(private authService: AuthService) {}

  @Get('login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { msg: 'Google Authentication' };
  }

  // api/auth/google/redirect
  @Get('callback')
  @UseGuards(GoogleAuthGuard)
  @Redirect(`${process.env.NEXT_PUBLIC_BASE_CLIENT_URL}`, 301)
  async handleCallback(@Req() req, @Res({ passthrough: true }) res) {
    // user data sẽ được lưu tự động vào database từ valida trong stategy

    const token = await this.authService.generateTokens({
      userId: req.user._id,
    });
    return {
      url:
        `${process.env.NEXT_PUBLIC_BASE_CLIENT_URL}/handle-extend-login/?accessToken=` +
        token.accessToken +
        '&refreshToken' +
        token.refreshToken,
    };
  }
}
