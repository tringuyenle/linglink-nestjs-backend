import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class ChatRoom {
  @Prop({ type: String, unique: true })
  chatRoomId: string;

  @Prop()
  name: string;

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  participant: User[];
  
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
