import { IsNotEmpty } from 'class-validator';
import { Question } from '../../../schemas/question.schema';
import { User } from '../../../schemas/user.schema';

export class UpdatePostDTO {
  topic: string;

  @IsNotEmpty()
  content: string;

  question: Question;

  img_url: string;

  upVotes: number;

  upVotesList: User[];

  downVotes: number;

  downVotesList: User[];

  author: User;

  createdAt: Date;

  updatedAt: Date;
}
