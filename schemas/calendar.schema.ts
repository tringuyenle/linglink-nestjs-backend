import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type EventDocument = Event & Document;

@Schema()
export class Event extends Document {
  @Prop()
  title: string;

  @Prop()
  descrip: string;

  @Prop()
  start: Date;

  @Prop()
  end: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);

export type CalendarDocument = Calendar & Document;

@Schema()
export class Calendar extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: [Types.ObjectId], ref: 'Event' })
  events: Event[];
}

export const CalendarSchema = SchemaFactory.createForClass(Calendar);
