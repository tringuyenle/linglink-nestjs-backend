import { IsEmail, IsNotEmpty } from 'class-validator'
import { UserRoles } from '../../common/enums/user.enum'

export class CreateUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  hashedPassword: string

  avatar: string

  name: string

  role: UserRoles

  createdAt: Date

  updatedAt: Date
}
