import { IsNotEmpty } from 'class-validator';
import { Question } from '../../../schemas/question.schema';

export class CreateTagDTO {
  @IsNotEmpty()
  tagName: string;

  questionsList: Question[];

  createdAt: Date;

  updatedAt: Date;
}
