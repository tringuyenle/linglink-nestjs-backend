import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class RequestAddFriend {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  sender: User;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  receiver: User;

  @Prop({ type: String, enum: ['PENDING', 'DONE'] })
  status: 'PENDING' | 'DONE';
}

export const RequestAddFriendSchema =
  SchemaFactory.createForClass(RequestAddFriend);
