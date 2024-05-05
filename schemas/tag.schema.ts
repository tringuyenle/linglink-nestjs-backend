import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';
import { Question } from './question.schema';

@Schema({ timestamps: true })
export class Tag {
  _id: ObjectId;

  @Prop()
  tagName: string;

  @Prop({ type: [Types.ObjectId], ref: 'Question' })
  questionsList: Question[];
}

export const TagSchema = SchemaFactory.createForClass(Tag);
