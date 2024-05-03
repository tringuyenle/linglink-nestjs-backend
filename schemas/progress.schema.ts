import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { Question } from './question.schema';

export type ProgressDocument = Progress & Document;

@Schema()
export class Progress extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  date: Date;

  @Prop({ type: [Types.ObjectId], ref: 'Question' })
  wrongAnswerQuestions: Question[];

  @Prop({ type: [Types.ObjectId], ref: 'Question' })
  totalQuestions: Question[];
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
