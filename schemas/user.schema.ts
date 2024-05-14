import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRoles } from '../src/common/enums/user.enum';
import { IsEnum } from 'class-validator';
import { Types } from 'mongoose';

export class Target {
  description: string;

  startDate: Date;

  targetDate: Date;
}

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ unique: true })
  email: string;

  @Prop()
  hashedPassword: string;

  @Prop()
  name: string;

  @Prop({ type: String, enum: UserRoles, default: UserRoles.STUDENT })
  @IsEnum(UserRoles)
  role: UserRoles;

  @Prop()
  avatar: string;

  @Prop()
  target: Target;

  @Prop()
  description: string;

  @Prop()
  phoneNumber: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
