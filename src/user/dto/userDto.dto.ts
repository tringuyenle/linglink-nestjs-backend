import { UserRoles } from 'src/common/enums/user.enum';

export class UserDTO {
  email?: string;

  hashedPassword?: string;

  avatar: string;

  name: string;

  role?: UserRoles;

  createdAt?: Date;

  updatedAt?: Date;

  target?: {
    description: string;
    startDate: Date;
    targetDate: Date;
  };
}
