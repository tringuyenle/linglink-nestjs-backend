import { Strategy, ExtractJwt } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthService } from '../auth.service'
import { UserService } from '../../user/user.service'
// import { JwtDto } from '../dto/jwt.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET')
    })
  }

  async validate(payload: { userId: string; email: string }) {
    const user = await this.userService.getByUserId(payload.userId)
    // const user = await this.authService.validateUser(payload.userId);
    if (!user) {
      throw new UnauthorizedException()
    }
    user.hashedPassword = undefined
    return user
  }
}
