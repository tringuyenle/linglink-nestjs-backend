import { IsEmail, IsNotEmpty } from 'class-validator'
import { Target } from '../../../schemas/user.schema'
import { UserRoles } from '../../common/enums/user.enum'

export class ResetPasswordDTO {
  @IsNotEmpty()
  userId: string

  @IsNotEmpty()
  token: string

  @IsNotEmpty()
  password: string
}
