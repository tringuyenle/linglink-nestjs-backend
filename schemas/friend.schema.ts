import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type FriendDocument = Friend & Document;

@Schema()
export class Friend extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  friends: User[];
}

export const FriendSchema = SchemaFactory.createForClass(Friend);
