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
    reciever: User;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    sender: User;
};

export const NotificationSchema = SchemaFactory.createForClass(Notification);