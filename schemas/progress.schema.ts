import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type ProgressDocument = Progress & Document;

export type ProgressQuestion = {
  question: Types.ObjectId;
  answer: number;
  createdAt: Date;
};

export type ProgressFlashcard = {
  flashcard: Types.ObjectId;
  isRemembered: boolean;
  createdAt: Date;
};

@Schema()
export class Progress extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  date: Date;

  @Prop({ type: [Types.ObjectId], ref: 'Question' })
  wrongAnswerQuestions: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Question' })
  totalQuestions: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Flashcard' })
  flashcards: Types.ObjectId[];

  @Prop({ ref: 'Question' })
  questions: ProgressQuestion[];

  @Prop({ ref: 'Flashcard' })
  flashcardsV2: ProgressFlashcard[];
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
