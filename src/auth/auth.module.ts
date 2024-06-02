import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import config from '../common/configs/config';
import { UserService } from '../user/user.service';
import { UserSchema } from '../../schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';
import { GoogleModule } from './google/google.module';
import { ReserPasswordTokenSchema } from 'schemas/reset-password-token.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { 
  Progress, 
  ProgressSchema 
} from '../../schemas/progress.schema';
import { AdminStrategy } from './strategy/jwt-admin.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: Progress.name, schema: ProgressSchema },
      { name: 'ReserPasswordToken', schema: ReserPasswordTokenSchema },
    ]),
    JwtModule.register({}),
    ConfigModule.forRoot({ load: [config] }),
    GoogleModule,
    MailerModule.forRoot({
      transport: {
        host: String(process.env.MAIL_HOST),
        port: Number(process.env.MAIL_PORT),
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      template: {
        adapter: new PugAdapter({ inlineCssEnabled: true }),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy, AdminStrategy],
})
export class AuthModule {}
