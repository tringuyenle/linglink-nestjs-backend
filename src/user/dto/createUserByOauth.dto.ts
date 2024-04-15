import { IsEmail, IsNotEmpty } from 'class-validator'
import { UserRoles } from '../../common/enums/user.enum'

export class CreateUserByOauthDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string

  hashedPassword: string

  name: string

  avatar: string

  role: UserRoles

  createdAt: Date

  updatedAt: Date
}
