import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from '../../../schemas/user.schema'
import { UserService } from '../../user/user.service'
import { AuthService } from '../auth.service'
import { GoogleStrategy } from '../strategy/google.strategy'
import { GoogleController } from './google.controller'
import { GoogleService } from './google.service'
import config from '../../common/configs/config'
import { MailerModule } from '@nestjs-modules/mailer'
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter'
import { ReserPasswordTokenSchema } from 'schemas/reset-password-token.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'ReserPasswordToken', schema: ReserPasswordTokenSchema }
    ]),
    JwtModule.register({}),
    ConfigModule.forRoot({ load: [config] }),
    MailerModule.forRoot({
      transport: {
        host: String(process.env.MAIL_HOST),
        port: Number(process.env.MAIL_PORT),
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      },
      template: {
        adapter: new PugAdapter({ inlineCssEnabled: true }),
        options: {
          strict: true
        }
      }
    })
  ],
  controllers: [GoogleController],
  providers: [GoogleService, GoogleStrategy, UserService, AuthService]
})
export class GoogleModule {}
