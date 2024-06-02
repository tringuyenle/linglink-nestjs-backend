import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum } from 'class-validator';
import { Types } from 'mongoose';
import { QuestionTypes } from '../src/common/enums/question.enum';
import { Tag } from './tag.schema';

@Schema({ timestamps: true })
export class Question {
  // @Prop()
  // questionName: string;
  _id: Types.ObjectId;

  @Prop({
    type: String,
    enum: QuestionTypes,
    default: QuestionTypes.MULTIPLE_CHOICE,
  })
  @IsEnum(QuestionTypes)
  type: QuestionTypes;

  @Prop({ type: [Types.ObjectId], ref: 'Tag' })
  tagsList: Tag[];

  @Prop()
  content: string;

  @Prop()
  answers: string[];

  @Prop()
  key: number;

  @Prop()
  audio_url: string;

  @Prop()
  imgs_url: string[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
