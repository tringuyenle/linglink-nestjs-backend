import { IsEmail, IsNotEmpty } from 'class-validator'
import { Target } from '../../../schemas/user.schema'
import { UserRoles } from '../../common/enums/user.enum'

export class RegisterDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  password: string

  name: string

  avatar: string

  role: UserRoles

  target: Target

  createdAt: Date

  updatedAt: Date
}
