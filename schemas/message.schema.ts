import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';
import { ChatRoom } from './chatroom.schema';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Message {
  _id: ObjectId;

  @Prop()
  content: string;

  @Prop()
  imgs_url: [string];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  from: User;

  @Prop({ type: Types.ObjectId, ref: 'ChatRoom' })
  chatRoomId: ChatRoom;

  @Prop()
  isViewed: boolean = false;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
