import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import * as argon from 'argon2'
import { RegisterDTO } from './dto'
import { UserService } from '../user/user.service'
import { LogInDTO } from './dto/login.dto'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Token } from './models/token.model'
import { SecurityConfig } from '../common/configs/config.interface'
import { ReserPasswordToken } from 'schemas/reset-password-token.schema'
import { Model, Types } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { MailerService } from '@nestjs-modules/mailer'
import * as path from 'path'
import * as pug from 'pug'

@Injectable({})
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerMain: MailerService,
    @InjectModel('ReserPasswordToken') private readonly reserPasswordTokenModel: Model<ReserPasswordToken>
  ) {}

  async register(registrationData: RegisterDTO) {
    if (registrationData.password.length < 8) {
      throw new HttpException('Password must be at least 8 characters long', HttpStatus.BAD_REQUEST)
    }
    //generate password to hashedpassword
    const hashedPassword = await argon.hash(registrationData.password)
    const { password, ...userData } = registrationData
    try {
      //insert data into database
      const createdUser = await this.userService.create({
        ...userData,
        hashedPassword: hashedPassword
      })

      return this.generateTokens({
        userId: createdUser.id
      })
    } catch (error) {
      if (error.code == '11000') {
        throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST)
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async login(loginData: LogInDTO) {
    try {
      const user = await this.userService.getByUserEmail(loginData.email)
      const isPasswordMatching = await argon.verify(user.hashedPassword, loginData.password)
      if (!isPasswordMatching) {
        throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED)
      }
      return this.generateTokens({
        userId: user.id
      })
    } catch (error) {
      return error
    }
  }

  async requestPasswordReset(mail: { email: string }) {
    const crypto = require('crypto')

    const user = await this.userService.getByUserEmail(mail.email)
    if (!user) throw new Error('Email does not exist')

    const token = await this.reserPasswordTokenModel.findOne({ user_id: user._id })
    if (token) await token.deleteOne()

    const resetToken = crypto.randomBytes(32).toString('hex')
    const hash = await argon.hash(resetToken)

    await new this.reserPasswordTokenModel({
      user_id: user._id,
      token: hash
    }).save()

    const link = `${process.env.NEXT_PUBLIC_BASE_CLIENT_URL}/reset-password?token=${resetToken}&id=${user._id}`

    const templateFile = path.join(__dirname, '../../../utils/email/template/requestResetPassword.pug')

    const data = {
      name: user.name,
      link: link
    }

    const render = pug.renderFile(templateFile, data)

    await this.mailerMain
      .sendMail({
        to: user.email,
        subject: 'Password Reset Request',
        text: 'acb',
        html: render
      })
      .then(() => {
        console.log('Email sent')
      })
      .catch((e) => {
        console.log('Error sending email', e)
      })

    return { link }
  }

  async resetPassword(userId: string, token: string, password: string) {
    const user_id = new Types.ObjectId(userId)
    const passwordResetToken = await this.reserPasswordTokenModel.findOne({ user_id: user_id })

    if (!passwordResetToken) {
      throw new Error('Invalid or expired password reset token')
    }

    const isValid = await argon.verify(passwordResetToken.token, token)

    if (!isValid) {
      throw new Error('Invalid or expired password reset token 2')
    }

    const hash = await argon.hash(password)

    await this.userService.updatePasswordForUser(userId, hash)
    await passwordResetToken.deleteOne()

    return { message: 'Password reset was successful' }
  }

  async generateTokens(payload: { userId: string }): Promise<Token> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload)
    ])

    return {
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  }

  async generateAccessToken(payload: { userId: string }): Promise<string> {
    const securityConfig = this.configService.get<SecurityConfig>('security')
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: securityConfig.expiresIn
    })
  }

  async generateRefreshToken(payload: { userId: string }): Promise<string> {
    const securityConfig = this.configService.get<SecurityConfig>('security')
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn
    })
  }

  async refreshToken(token: string) {
    try {
      const { userId } = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET')
      })

      return this.generateTokens({
        userId
      })
    } catch (e) {
      throw new UnauthorizedException()
    }
  }
}
