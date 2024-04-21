import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { UserRoles } from '../../common/enums/user.enum';
import { UserService } from '../../user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // console.log(accessToken);
    // console.log(refreshToken);
    // console.log(profile);
    const user = await this.userService.findOrCreateByOauth({
      email: profile._json.email,
      name: profile._json.name,
      avatar: profile._json.picture,
      hashedPassword: undefined,
      role: UserRoles.STUDENT,
      createdAt: undefined,
      updatedAt: undefined,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    // user.hashedPassword = undefined;
    return user;
  }
}
