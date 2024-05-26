import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  receiver: User;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  sender: User;

  @Prop()
  isViewed: boolean = false;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
