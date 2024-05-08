import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Question } from './question.schema';

@Schema({ timestamps: true })
export class Tag {
  @Prop()
  tagName: string;

  @Prop({ type: [Types.ObjectId], ref: 'Question' })
  questionsList: Question[];
}

export const TagSchema = SchemaFactory.createForClass(Tag);
